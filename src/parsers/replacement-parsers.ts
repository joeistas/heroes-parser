import {
  getElement,
  getElementAttributes,
  joinElements,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementParser, ParseContext, findElementName } from './'
import { ElementNameFilter } from './element-name-filters'

export function replaceAttributesWithElementAttribute(
  regexp: RegExp,
  elementNameOrFilter: string | ElementNameFilter,
  valueAttribute = 'value'
): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const attributes = getElementAttributes(element)
    Object.keys(attributes).filter(attribute => {
        const value = attributes[attribute]
        return value !== undefined && typeof value === 'string' && value.match(regexp)
      })
      .forEach(attribute => {
        const parser = replaceAttributeWithElementAttribute(elementNameOrFilter, attribute, valueAttribute)
        element = parser(element, outerElement, parseData, context)
      })

    return element
  }
}

export function replaceAttributeWithElementAttribute(
  elementNameOrFilter: string | ElementNameFilter,
  attribute: string = 'value',
  valueAttribute: string = 'value'
): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const attributes = getElementAttributes(element)
    if(attributes[attribute] === undefined) {
      return element
    }

    const elementName = findElementName(elementNameOrFilter, attributes[attribute], parseData)
    if(!elementName) {
      return element
    }

    const valueElement = joinElements(getElement(attributes[attribute], elementName, parseData.elements))
    if(!valueElement) {
      return element
    }

    const valueElementAttributes = getElementAttributes(valueElement)
    if(valueElementAttributes[valueAttribute] === undefined) {
      return element
    }

    attributes[attribute] = valueElementAttributes[valueAttribute]
    return element
  }
}
