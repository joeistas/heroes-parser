import {
  ElementMerger,
  getElementAttributes,
  getElement,
  getElementFunction,
  findElementNameForId,
  reduceElements,
  ElementParser
} from '../element'
import { ParseData } from '../parser'
import { ElementNameFilter } from './filters'

export function addAttribute(name: string, value: string, override: boolean = false) {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    attributes[name] = override || !attributes[name] ? value : attributes[name]

    return element
  }
}

export function addInnerElement(elementNameOrFilter: string | ElementNameFilter, attribute: string = 'value'): ElementParser {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    const elementNames = typeof elementNameOrFilter === 'string' ? [ elementNameOrFilter ] : elementNameOrFilter(parseData)

    const elementName = findElementNameForId(elementNames, attributes[attribute], parseData.elements)
    const innerElement = reduceElements(getElement(attributes[attribute], elementName, parseData.elements), parseData)

    const innerElements = element[elementName] || []
    const mergeFunction = getElementFunction(elementName, parseData.functions, "merge") as ElementMerger
    element[elementName] = mergeFunction ?
      mergeFunction(innerElements, [ innerElement ], getElementAttributes(element), parseData) :
      [ ...innerElements, innerElement ]

    return element
  }
}
