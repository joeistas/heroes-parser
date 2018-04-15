import {
  ATTRIBUTE_BLACKLIST,
  getElementAttributes,
  getElement,
  findElementNameForId,
  reduceElements,
  mergeElements,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementNameFilter } from './element-name-filters'
import { preParseElement, ElementParser } from './'

export function mergeElement(elementNameOrFilter: string | ElementNameFilter, attribute: string = 'value'): ElementParser {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    if(attributes[attribute] === undefined) {
      return element
    }

    const elementNames = typeof elementNameOrFilter === 'string' ? [ elementNameOrFilter ] : elementNameOrFilter(parseData)
    const elementName = findElementNameForId(elementNames, attributes[attribute], parseData.elements)
    if(!elementName) {
      return element
    }

    let replacementElement = reduceElements(getElement(attributes[attribute], elementName, parseData.elements), parseData)
    replacementElement = mergeElements(element, replacementElement, parseData, ATTRIBUTE_BLACKLIST.concat(attribute))

    return preParseElement(replacementElement, containingElement, elementName, parseData)
  }
}
