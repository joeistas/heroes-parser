import {
  ATTRIBUTE_BLACKLIST,
  getElementAttributes,
  getElement,
  findElementNameForId,
  joinElements,
  mergeElements,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementNameFilter } from './element-name-filters'
import { preParseElement, ElementParser, ParseContext } from './'
import { getAtPath, setAtPath } from '../utils'

export function mergeElement(elementNameOrFilter: string | ElementNameFilter, attribute: string = 'value'): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const attributes = getElementAttributes(element)
    if(attributes[attribute] === undefined) {
      return element
    }

    const elementName = findElementName(elementNameOrFilter, attributes[attribute], parseData)
    if(!elementName) {
      return element
    }

    let replacementElement = joinElements(getElement(attributes[attribute], elementName, parseData.elements))
    replacementElement = mergeElements(element, replacementElement, parseData, ATTRIBUTE_BLACKLIST.concat(attribute))
    context = Object.assign({}, context, getElementAttributes(replacementElement))

    return preParseElement(replacementElement, outerElement, elementName, parseData, context)
  }
}

export function mergeElementFromInnerElementValue(
  elementNameOrFilter: string | ElementNameFilter,
  innerElementName: string,
  attribute: string = 'value',
  removeInnerElements: boolean = true
): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const innerElement = preParseElement(element[innerElementName][0], outerElement, innerElementName, parseData, context)
    const innerElementAttributes = getElementAttributes(innerElement)

    const elementId = innerElementAttributes[attribute]
    if(!elementId) {
      return element
    }

    const elementName = findElementName(elementNameOrFilter, elementId, parseData)
    if(!elementName) {
      return element
    }

    if(removeInnerElements) {
      delete element[innerElementName]
    }

    let replacementElement = joinElements(getElement(elementId, elementName, parseData.elements))
    replacementElement = mergeElements(element, replacementElement, parseData)
    context = Object.assign({}, context, getElementAttributes(replacementElement))

    return preParseElement(replacementElement, outerElement, elementName, parseData, context)
  }
}

function findElementName(elementNameOrFilter: string | ElementNameFilter, elementId: string, parseData: ParseData): string {
  const elementNames = typeof elementNameOrFilter === 'string' ? [ elementNameOrFilter ] : elementNameOrFilter(parseData)
  return findElementNameForId(elementNames, elementId, parseData.elements)
}
