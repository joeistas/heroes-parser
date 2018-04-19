import {
  ELEMENT_NAME_KEY,
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  getElement,
  getElementFunction,
  findElementNameForId,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementNameFilter } from './element-name-filters'
import { ElementParser } from './'
import { ElementMerger } from '../merge'

export function addAttribute(name: string, value: string, override: boolean = false) {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    attributes[name] = override || !attributes[name] ? value : attributes[name]

    return element
  }
}

export function addInnerElement(attribute: string, key: string, innerAttribute: string = 'value', innerName?: string): ElementParser {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    if(!attributes[attribute]) {
      return element
    }

    innerName = innerName || key

    const innerElement = {
      [ELEMENT_ATTRIBUTE_KEY]: { [innerAttribute]: attributes[attribute] },
      [ELEMENT_NAME_KEY]: innerName
    }
    const innerElements = element[key] || []
    const mergeFunction = getElementFunction(key, parseData.functions, "merge") as ElementMerger
    element[key] = mergeFunction ?
      mergeFunction(innerElements, [ innerElement ], getElementAttributes(element), parseData) :
      [ ...innerElements, innerElement ]

    return element
  }
}
