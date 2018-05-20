import * as cheerio from 'cheerio'
import * as Handlebars from 'handlebars'

import {
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  mergeAttributes,
  findElementNameForId,
  joinElements,
  mergeWithParent,
  getElement,
  getAtPath,
} from './element'
import { startsWith } from './parsers/element-name-filters'
import { ParseData } from './parse-data'
import { splitOnCaps } from './utils'

const _eval = require('eval')

export interface TooltipReference {
  name?: string
  catalog: string
  entry: string
  field: string
}

export interface TooltipVariable {
  name?: string
  counter: string
  min: number
  max: number
  scale: number
}

export interface TooltipData {
  localeText: { [locale: string]: string }
  formulas: { [formulaName: string]: string }
  references: { [referenceName: string]: TooltipReference }
  variables: { [variableName: string]: TooltipVariable }
}

export type TooltipFormulaReplaceFunction = (variableName: string) => string
export type TooltipElementReplaceFunction = ($: CheerioStatic, element: CheerioElement) => string
export type TooltipRenderFunction = (text: string, formulaResults: { [formulaName: string]: any }, tooltipData: TooltipData) => string

export function parseTooltipLocaleText(
  localeText: { [locale: string]: string },
  parseData: ParseData,
  formulaElement: TooltipFormulaReplaceFunction = handleBarsTemplateReplacement,
  templateElement: TooltipElementReplaceFunction = toSpanElement,
): Partial<TooltipData> {
  if(Object.keys(localeText).length === 0) {
    return {}
  }

  const parsedTooltips: { [locale: string]: string } = {}
  const references = new Map()
  const variables = new Map()
  const formulas: { [index: string]: string } = {}

  for(const locale of Object.keys(localeText)) {
    if(!locale) {
      continue
    }

    const $ = cheerio.load(localeText[locale])

    $("d").each((index, element) => {
      const formulaName = 'formula' + index
      $(element).replaceWith(formulaElement(formulaName))
      const formula = parseFormula($(element).attr('ref'), references, variables, parseData)
      formulas[formulaName] = formula
    })

    $("c").each((index, element) => {
      $(element).replaceWith(templateElement($, element))
    })

    parsedTooltips[locale] = $("body").html()
  }

  const tooltipData: Partial<TooltipData> = { localeText: parsedTooltips }
  if(Object.keys(formulas).length > 0) {
    tooltipData.formulas = formulas
  }

  if(references.size > 0) {
    tooltipData.references = [ ...references.values() ].reduce((result, data) => {
      const reference = data.name
      delete data.name
      result[reference] = data
      return result
    }, {})
  }

  if(variables.size > 0) {
    tooltipData.variables = [ ...variables.values() ].reduce((result, data) => {
      const variable = data.name
      delete data.name
      result[variable] = data
      return result
    }, {})
  }
  
  return tooltipData
}

export function renderTooltipData(
  tooltipData: TooltipData,
  parseData: ParseData,
  render: TooltipRenderFunction = renderTooltipWithHandlebars,
  variableValues: { [variableName: string]: number } = {},
): { [locale: string]: string } {

  const calculationContext = Object.entries(tooltipData.references || {}).reduce((values, [ refName, ref ]) => {
    values[refName] = getValueForReference(ref, parseData)
    return values
  }, {} as any)

  Object.entries(tooltipData.variables || {}).reduce((values, [ variableName, variable ]) => {
    values[variableName] = variableValues[variableName] || variable.min
    return values
  }, calculationContext)

  const formulaResults: { [formulaName: string]: string } = {}
  for(const [ formulaName, formula ] of Object.entries(tooltipData.formulas)) {
    const evalText = `exports.result = ${ formula }`
    formulaResults[formulaName] = _eval(evalText, calculationContext).result
  }

  const localeText = tooltipData.localeText

  const renderedTooltips: { [locale: string]: string } = {}
  for(const locale of Object.keys(localeText)) {
    renderedTooltips[locale] = render(localeText[locale], formulaResults, tooltipData)
  }

  return renderedTooltips
}

export function handleBarsTemplateReplacement(variable: string): string {
  return `{{ ${ variable } }}`
}

export function toSpanElement($: CheerioStatic, element: CheerioElement): string {
  return `<span>${ $(element).html() }</span>`
}

export function renderTooltipWithHandlebars(text: string, formulaResults: { [formulaName: string]: any }, tooltipData: TooltipData): string {
  const template = Handlebars.compile(text)
  return template(formulaResults)
}

export function parseFormula(formula: string, references: Map<string, TooltipReference>, variables: Map<string, TooltipVariable>, parseData: ParseData): string {
  if(!formula) {
    return '0'
  }

  // convert [d ref='' ] style elements
  formula = formula.replace(/\[d\sref='(.*?)'.*\]/, "$1")

  const replacements: [ number, string, string ][] = []
  const regExp = /(\$([\w,\.\[\]\:]+)\$)|([A-Za-z][\w,\.\[\]]+)/g
  let match: RegExpExecArray
  while((match = regExp.exec(formula)) !== null) {
    if(match[1]) {
      const variable = match[2]
      parseVariable(variable, variables, parseData)

      const variableName = variables.get(variable).name
      replacements.unshift([ match.index, variable, variableName ])
    }
    else {
      const reference = match[3]
      parseReference(reference, references)

      const referenceName = references.get(reference).name
      replacements.unshift([ match.index, reference, referenceName ])
    }
  }

  for(const [ index, replace, replacement ] of replacements) {
    formula = formula.slice(0, index) + replacement + formula.slice(index + replace.length)
  }

  return formula
}

export function parseVariable(variable: string, variables: Map<string, TooltipVariable>, parseData: ParseData) {
  if(variables.has(variable)) {
    return
  }

  const [ catalogField, reference ] = variable.split(':')
  const [ catalog, entry, field ] = reference.split(',')

  let variableData: TooltipVariable
  if(entry && field) {
    variableData = parseVariableReference(catalog, entry, field, parseData)
  }
  else {
    variableData = parseVariableToken(catalogField, reference, parseData)
  }

  variableData.name = `var${ variables.size }`
  variables.set(variable, variableData as TooltipVariable)
}

export function parseVariableReference(catalog: string, entry: string, field: string, parseData: ParseData): TooltipVariable {
  const element = getEntry(catalog, entry, parseData)
  const accumulatorValue = getAtPath(element, field + '.AccumulatorArray')

  let accumulator
  if(accumulatorValue) {
    accumulator = getEntry('Accumulator', accumulatorValue, parseData)
  }

  return {
    ...getVariableValues(element, accumulator),
    counter: entry,
  } as TooltipVariable
}

export function parseVariableToken(catalogField: string, entry: string, parseData: ParseData): TooltipVariable {
  const parts = splitOnCaps(catalogField).split(' ')
  const [ catalog, ...fieldParts ] = parts

  const element = getEntry(catalog, entry, parseData)
  const accumulatorValue = getAtPath(element, fieldParts.join('') + 'Accumulator')
  let accumulator
  if(accumulatorValue) {
    accumulator = getEntry('Accumulator', accumulatorValue, parseData)
  }

  return {
    ...getVariableValues(element, accumulator),
    counter: entry,
  } as TooltipVariable
}

function getVariableValues(element: any, accumulator: any): Partial<TooltipVariable> {
  if(accumulator) {
    return {
      min: getValue(accumulator, 'MinAccumulation'),
      max: getValue(accumulator, 'MaxAccumulation'),
      scale: getValue(accumulator, 'Scale'),
    }
  }
  else {
    return {
      min: 0,
      max: getValue(element, 'Max'),
      scale: 1,
    }
  }
}

function getValue(element: any, field: string, defaultValue: number = 0): number {
  let value = getAtPath(element, field)
  if(!value) {
    return defaultValue
  }
  value = parseFloat(value)
  return isNaN(value) ? defaultValue : value
}

export function parseReference(reference: string, references: Map<string, TooltipReference>) {
  if(references.has(reference)) {
    return
  }

  const [ catalog, entry, field ] = reference.split(',')

  references.set(reference, {
    name: `ref${ references.size }`,
    catalog,
    entry,
    field: field.replace(/\[/g, '.').replace(/\]/g, ''),
  })
}

function getEntry(catalog: string, entry: string, parseData: ParseData): any {
  const names = startsWith('C' + catalog)(parseData)
  const elementName = findElementNameForId(names, entry, parseData.elements)
  if(!elementName) {
    return null
  }

  const element = joinElements(getElement(entry, elementName, parseData.elements))
  return mergeWithParent(element, elementName, parseData)
}

function getValueForReference(ref: TooltipReference, parseData: ParseData): any {
  const element = getEntry(ref.catalog, ref.entry, parseData)
  if(!element) {
    return null
  }

  return getAtPath(element, ref.field)
}
