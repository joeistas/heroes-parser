import {
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  mergeAttributes,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementParser } from './'

const REPLACEMENT_REGEXP = /(##([^#]+)##)/

export function attributeValueReplacement(attribute: string = 'value'): ElementParser {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const values = mergeAttributes(containingElement, element)

    const value = getElementAttributes(element)[attribute]
    if(!value) {
      return element
    }

    const match = REPLACEMENT_REGEXP.exec(value)
    if(!match) {
      return element
    }

    element[ELEMENT_ATTRIBUTE_KEY][attribute] = value.replace(match[1], values[match[2]])

    return element
  }
}

export function replaceWithLocaleText(attribute: string = 'value'): ElementParser {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const elementAttributes = getElementAttributes(element)
    if(!elementAttributes[attribute]) {
      return element
    }

    const localeText = parseData.text.get(elementAttributes[attribute])
    let textObject = {}
    if(localeText) {
      textObject = [ ...localeText.entries() ].reduce((reduced: any, [key, value]) => {
        reduced[key] = value
        return reduced
      }, {})
    }

    elementAttributes[attribute] = textObject
    return element
  }
}
