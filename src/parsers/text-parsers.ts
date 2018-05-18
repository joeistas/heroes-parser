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
} from '../element'
import { ParseData } from '../parse-data'
import { startsWith } from './element-name-filters'
import { getAtPath } from '../utils'
import { ElementParser, ParseContext } from './'

const _eval = require('eval')

const REPLACEMENT_REGEXP = /(##([^#]+)##)/

export interface TooltipReference {
  variable?: string
  catalog: string
  entry: string
  field: string
}

export interface TooltipData {
  text: string
  formulas: { [formulaName: string]: string }
  references: { [variableName: string]: TooltipReference }
}

export function attributeValueReplacement(attribute: string = 'value'): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const value = getElementAttributes(element)[attribute]
    if(!value) {
      return element
    }

    const match = REPLACEMENT_REGEXP.exec(value)
    if(!match) {
      return element
    }

    const replacement = context[match[2]]
    if(replacement) {
      element[ELEMENT_ATTRIBUTE_KEY][attribute] = value.replace(match[1], replacement)
    }

    return element
  }
}

export function replaceWithLocaleText(attribute: string = 'value'): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const elementAttributes = getElementAttributes(element)
    if(!elementAttributes[attribute]) {
      return element
    }

    const localeText = parseData.text.get(elementAttributes[attribute])
    let textObject: any = {}
    if(localeText) {
      textObject = [ ...localeText.entries() ].reduce((reduced: any, [key, value]) => {
        reduced[key] = value
        return reduced
      }, {})
    }

    const keys = Object.keys(textObject)
    elementAttributes[attribute] = textObject
    return element
  }
}

export function parseTooltip(
  attribute: string = 'value',
  formulaElement: (variableName: string) => string = handleBarsTemplateReplacement,
  templateElement: ($: CheerioStatic, element: CheerioElement) => string = toSpanElement,
): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const elementAttributes = getElementAttributes(element)
    if(!elementAttributes[attribute]) {
      return element
    }

    const value = elementAttributes[attribute]
    const parsedTooltips: { [locale: string]: TooltipData } = {}

    for(const locale of Object.keys(value)) {
      const $ = cheerio.load(value[locale])
      const references = new Map()
      const formulas: { [index: string]: string } = {}

      $("d").each((index, element) => {
        const formulaName = 'formula' + index
        $(element).replaceWith(formulaElement(formulaName))
        const formula = parseFormula($(element).attr('ref'), references)
        formulas[formulaName] = formula
      })

      $("c").each((index, element) => {
        $(element).replaceWith(templateElement($, element))
      })

      parsedTooltips[locale] = {
        text: $("body").html(),
        formulas,
        references: [ ...references.values() ].reduce((result, reference) => {
          const variable = reference.variable
          delete reference.variable
          result[variable] = reference
          return result
        }, {})
      }
    }

    elementAttributes[attribute] = parsedTooltips

    return element
  }
}

export function renderTooltip(
  attribute: string = 'value',
  render: (tooltipData: TooltipData, formulaResults: { [formulaName: string]: any }) => string = renderTooltipWithHandlebars
) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const elementAttributes = getElementAttributes(element)
    if(!elementAttributes[attribute]) {
      return element
    }

    const value = elementAttributes[attribute]
    const renderedTooltips: { [locale: string]: string } = {}

    for(const locale of Object.keys(value)) {
      const tooltipData = value[locale] as TooltipData
      const calculationContext = Object.entries(tooltipData.references).reduce((values, [ variableName, ref ]) => {
        values[variableName] = getValueForReference(ref, parseData)
        return values
      }, {} as any)

      const formulaResults: { [formulaName: string]: string } = {}
      for(const [ formulaName, formula ] of Object.entries(tooltipData.formulas)) {
        const evalText = `const result = ${ formula }; exports.result = result`
        formulaResults[formulaName] = _eval(evalText, calculationContext).result
      }

      renderedTooltips[locale] = render(tooltipData, formulaResults)
    }

    elementAttributes[attribute] = renderedTooltips

    return element
  }
}

export function handleBarsTemplateReplacement(variable: string): string {
  return `{{ ${ variable } }}`
}

export function toSpanElement($: CheerioStatic, element: CheerioElement): string {
  return `<span>${ $(element).html() }</span>`
}

export function renderTooltipWithHandlebars(tooltipData: TooltipData, formulaResults: { [formulaName: string]: any }): string {
  const template = Handlebars.compile(tooltipData.text)
  return template(formulaResults)
}

function parseFormula(formula: string, references: Map<string, TooltipReference>): string {
  const regExp = /[A-Za-z][\w,\.\[\]]+/g
  const replacements: [ number, string, string ][] = []
  let match: RegExpExecArray
  while((match = regExp.exec(formula)) !== null) {
    const reference = match[0]
    const [ catalog, entry, field ] = reference.split(',')

    if(!references.has(reference)) {
      references.set(reference, {
        variable: `ref${ references.size }`,
        catalog,
        entry,
        field: field.replace(/\[/g, '.').replace(/\]/g, ''),
      })
    }

    const variableName = references.get(reference).variable
    replacements.unshift([ match.index, reference, variableName ])
  }

  for(const [ index, reference, variableName ] of replacements) {
    formula = formula.slice(0, index) + variableName + formula.slice(index + reference.length)
  }

  return formula
}

function getValueForReference(ref: TooltipReference, parseData: ParseData): any {
  const names = startsWith('C' + ref.catalog)(parseData)
  const elementName = findElementNameForId(names, ref.entry, parseData.elements)
  if(!elementName) {
    return null
  }

  let element = joinElements(getElement(ref.entry, elementName, parseData.elements))
  element = mergeWithParent(element, elementName, parseData)

  let value = getAtPath(element, ref.field)
  value = Array.isArray(value) ? value[0] : value
  return (typeof value === 'string' ? value : getElementAttributes(value).value)
}
