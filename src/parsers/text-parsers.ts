import {
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
} from '../element'
import { ParseData } from '../parse-data'
import {
  TooltipElementReplaceFunction,
  TooltipFormulaReplaceFunction,
  parseTooltipLocaleText,
  handleBarsTemplateReplacement,
  toSpanElement,
} from '../tooltip'
import { ElementParser, ParseContext } from './'

const REPLACEMENT_REGEXP = /(##([^#]+)##)/

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

    const replacement = context.attributes[match[2]]
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
  formulaElement: TooltipFormulaReplaceFunction = handleBarsTemplateReplacement,
  templateElement: TooltipElementReplaceFunction = toSpanElement,
): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const elementAttributes = getElementAttributes(element)
    if(!elementAttributes[attribute]) {
      return element
    }

    elementAttributes[attribute] = parseTooltipLocaleText(elementAttributes[attribute], parseData, formulaElement, templateElement)

    return element
  }
}
