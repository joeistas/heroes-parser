import * as cheerio from 'cheerio'
import * as Handlebars from 'handlebars'
import * as sanitizeHtml from 'sanitize-html'

import {
  findElementNameForId,
  joinElements,
  mergeWithParent,
  getElement,
  getValueAtPath,
} from './element'
import { startsWith } from './parsers/element-name-filters'
import { ParseData } from './parse-data'
import { getLogger } from './logger'
import { splitOnCaps } from './utils'

const _eval = require('eval')

export interface TooltipReference {
  name?: string
  catalog: string
  entry: string
  field: string
  value: number
}

export interface TooltipVariable {
  name?: string
  counter: string
  min: number
  max: number
  scale: number
}

export interface TooltipFormula {
  formula: string,
  precision: number,
  result?: string,
}

export interface TooltipData {
  localeText: { [locale: string]: string }
  formulas: { [formulaName: string]: TooltipFormula }
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
  const formulas: { [index: string]: TooltipFormula } = {}

  for(const locale of Object.keys(localeText)) {
    if(!locale) {
      continue
    }

    //Fix for newline XML errors
    const localeTextString = localeText[locale].replace(/<\/n>/g, '<n/>');

    const $ = cheerio.load(localeTextString)

    $("n").each((index, element) => {
      $(element).replaceWith(replaceNWithBrElements($, element))
    })

    $("d").each((index, element) => {
      const formula = parseFormula($(element).attr('ref'), references, variables, parseData)
      const precision = $(element).attr('precision') || '0'
      const formulaName = Object.keys(formulas).find(f => formulas[f].formula === formula) || 'formula' + Object.keys(formulas).length

      $(element).replaceWith(formulaElement(formulaName) + $(element).html())
      formulas[formulaName] = { formula, precision: parseInt(precision) }
    })

    $("c").each((index, element) => {
      $(element).replaceWith(templateElement($, element))
    })

    // Added sanitize-html to fix issue with cherrio converting non-latin text to html entities
    // sanitize-html converts the non-latin text to unicode while preserving html entities
    // https://github.com/cheeriojs/cheerio/issues/866
    parsedTooltips[locale] = sanitizeHtml($("body").html(), {
      allowedTags: false,
      allowedAttributes: false,
    })
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

export function computeTooltipDataFormulas(
  tooltipData: Partial<TooltipData>,
  variableValues: { [variableName: string]: number } = {},
): TooltipData {
  if(!tooltipData.formulas) {
    return tooltipData as TooltipData
  }

  const calculationContext = Object.entries(tooltipData.references || {}).reduce((values, [ refName, ref ]) => {
    if(ref.value === null || ref.value === undefined) {
      return values
    }

    values[refName] = ref.value
    return values
  }, {} as any)

  Object.entries(tooltipData.variables || {}).reduce((values, [ variableName, variable ]) => {
    values[variableName] = variableValues[variableName] || variable.min
    return values
  }, calculationContext)

  for(const formula of Object.values(tooltipData.formulas)) {
    const evalText = `exports.result = ${ formula.formula }`
    const precision = formula.precision || 0

    try{
      formula.result = _eval(evalText, calculationContext).result.toFixed(precision)
    }
    catch(e) {
      const logger = getLogger()
      logger.error(e)

      formula.result = 'NaN'
    }
  }

  return tooltipData as TooltipData
}

export function renderTooltipData(
  tooltipData: TooltipData,
  render: TooltipRenderFunction = renderTooltipWithHandlebars,
): { [locale: string]: string } {
  const localeText = tooltipData.localeText || {}

  const renderedTooltips: { [locale: string]: string } = {}
  for(const locale of Object.keys(localeText)) {
    const formulaResults = Object.keys(tooltipData.formulas || {}).reduce((results, formulaName) => {
      results[formulaName] = tooltipData.formulas[formulaName].result
      return results
    }, {} as any)
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

/** @hidden */
export function parseFormula(formula: string, references: Map<string, TooltipReference>, variables: Map<string, TooltipVariable>, parseData: ParseData): string {
  if(!formula) {
    return '0'
  }

  // convert [d ref='' ] style elements
  formula = formula.replace(/\[d\sref='(.*?)'.*\]/, "$1")
  // remove trailing operators
  formula = formula.replace(/[/*\-+]+$/, "")

  const replacements: [ number, string, string ][] = []
  const regExp = /(\$([\w,'\.\[\]\:]+)\$)|([A-Za-z][\w,'\.\[\]]+)/g
  let match: RegExpExecArray
  while((match = regExp.exec(formula)) !== null) {
    if(match[1]) {
      const variable = match[2]
      parseVariable(variable, variables, parseData)

      const variableName = variables.get(variable).name
      replacements.unshift([ match.index, match[1], variableName ])
    }
    else {
      const reference = match[3]
      parseReference(reference, references, parseData)

      const referenceName = references.get(reference).name
      replacements.unshift([ match.index, reference, referenceName ])
    }
  }

  for(const [ index, replace, replacement ] of replacements) {
    formula = formula.slice(0, index) + replacement + formula.slice(index + replace.length)
  }

  return convertFormulaToStandardPrecedence(removeUnmatchedParens(formula))
}

/** @hidden */
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

/** @hidden */
export function parseVariableReference(catalog: string, entry: string, field: string, parseData: ParseData): TooltipVariable {
  const element = getEntry(catalog, entry, parseData)
  const accumulatorValue = getValueAtPath(element, field + '.AccumulatorArray')

  let accumulator
  if(accumulatorValue) {
    accumulator = getEntry('Accumulator', accumulatorValue, parseData)
  }

  return {
    ...getVariableValues(element, accumulator),
    counter: entry,
  } as TooltipVariable
}

/** @hidden */
export function parseVariableToken(catalogField: string, entry: string, parseData: ParseData): TooltipVariable {
  const parts = splitOnCaps(catalogField).split(' ')
  const [ catalog, ...fieldParts ] = parts

  const element = getEntry(catalog, entry, parseData)
  const accumulatorValue = getValueAtPath(element, fieldParts.join('') + 'Accumulator')
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
  let value = getValueAtPath(element, field)
  if(!value) {
    return defaultValue
  }
  value = parseFloat(value)
  return isNaN(value) ? defaultValue : value
}

/** @hidden */
export function parseReference(reference: string, references: Map<string, TooltipReference>, parseData: ParseData) {
  if(references.has(reference)) {
    return
  }

  let [ catalog, entry, field ] = reference.split(',')
  field = field.replace(/\[/g, '.').replace(/\]/g, '')

  const value = getValueForReference(catalog, entry, field, parseData)
  if(!value) {
    const logger = getLogger()
    logger.debug(`Warning: Unable to find value for reference: ${ catalog }, ${ entry }, ${ field } defaulting to 0`)
  }

  references.set(reference, {
    name: `ref${ references.size }`,
    catalog,
    entry,
    field,
    value: value ? parseFloat(value) : 0
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

function getValueForReference(catalog: string, entry: string, field: string, parseData: ParseData): string {
  const element = getEntry(catalog, entry, parseData)
  if(!element) {
    return null
  }

  return getValueAtPath(element, field)
}

function replaceNWithBrElements($: CheerioStatic, element: CheerioElement): string {
  $('n', element).each((index, e) => {
    $(e).replaceWith(replaceNWithBrElements($, e))
  })

  return '<br/>' + $(element).html()
}

function removeUnmatchedParens(formula: string): string {
  const unmatchedOpenParens: number[] = []
  const unmatchedCloseParens: number[] = []

  for(let i = 0; i < formula.length; i++) {
    const char = formula[i]
    if(char === '(') {
      unmatchedOpenParens.push(i)
    }

    if(char === ')' && unmatchedOpenParens.length === 0) {
      unmatchedCloseParens.push(i)
      continue
    }

    if(char === ')') {
      unmatchedOpenParens.pop()
    }
  }

  const remove = unmatchedOpenParens.concat(unmatchedCloseParens).sort((a, b) => b - a)
  for(const i of remove) {
    formula = formula.slice(0, i) + formula.slice(i + 1)
  }

  return formula
}

/** @hidden */
export function convertFormulaToStandardPrecedence(formula: string): string {
  const operators: [ number, number ][] = []
  const changes: [ number, number, string ][] = []
  const unmatchedOpenParens: number[] = []

  for(let i = 0; i < formula.length; i++) {
    const char = formula[i]
    switch(char) {
      case '(':
        unmatchedOpenParens.push(i)
        break;

      case ')':
        const start = unmatchedOpenParens.pop()
        changes.push([ start + 1, i - start - 1, convertFormulaToStandardPrecedence(formula.substring(start + 1, i)) ])
        break;

      case '+':
      case '-':
        if(unmatchedOpenParens.length > 0) {
          break;
        }

        // if unary subtract continue
        if(char === '-' && (i === 0 || formula.slice(0, i).match(/[+\-*/]\s*$/))) {
          break;
        }

        operators.push([ 0, i ])
        break;

      case '*':
      case '/':
        if(unmatchedOpenParens.length > 0) {
          break;
        }

        operators.push([ 1, i ])
        break;
    }
  }


  if(operators.length > 1) {
    let [ prev, ] = operators.shift()
    for(const [ precedence, index ] of operators) {
      if(prev === precedence) {
        continue
      }

      changes.push([ 0, 0, '(' ])
      changes.push([ index, 0, ')' ])
      prev = precedence
    }
  }

  if(changes.length === 0) {
    return formula
  }

  for(const [ start, length, replacement ] of changes.sort((a, b) => b[0] - a[0])) {
    formula = formula.slice(0, start) + replacement + formula.slice(start + length)
  }

  return formula
}
