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
import { preParseElement, ElementParser } from './'
import { getAtPath, setAtPath } from '../utils'

export function mergeElement(elementNameOrFilter: string | ElementNameFilter, attribute: string = 'value'): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData): any => {
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

    return preParseElement(replacementElement, outerElement, elementName, parseData)
  }
}

export function mergeElementFromInnerElementValue(
  elementNameOrFilter: string | ElementNameFilter,
  innerElementName: string,
  attribute: string = 'value',
  removeInnerElements: boolean = true
): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData): any => {
    const innerElement = preParseElement(element[innerElementName][0], outerElement, innerElementName, parseData)
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

    return preParseElement(replacementElement, outerElement, elementName, parseData)
  }
}

export function mergeInnerElementsViaLink(
  innerElementName: string,
  subElementPaths: string[],
  linkedElementsNameOrFilter: string | ElementNameFilter,
  linkAttribute: string = 'Link'
) {
  return (element: any, outerElement: any, parseData: ParseData): any => {
    if(!element[innerElementName]) {
      return element
    }

    const innerElements = []
    for(const i in element[innerElementName]) {
      const innerElement = element[innerElementName][i]
      const index = getElementAttributes(innerElement).index || i
      const [ subElementPath, subElement ] = findInnerElement(innerElement, subElementPaths)
      if(!subElement) {
        innerElements.push(innerElement)
        continue
      }

      const innerElementAttributes = getElementAttributes(subElement)
      if(!innerElementAttributes[linkAttribute]) {
        innerElements.push(innerElement)
        continue
      }

      const parts = innerElementAttributes[linkAttribute].split('/')
      const linkId = parts ? parts[parts.length - 1] : innerElementAttributes[linkAttribute]
      const elementName = findElementName(linkedElementsNameOrFilter, linkId, parseData)

      const linkedElement = joinElements(getElement(linkId, elementName, parseData.elements))
      if(!linkedElement) {
        innerElements.push(innerElement)
        continue
      }

      const [ , linkedInnerElement ] = findInnerElement(linkedElement, subElementPaths.map(path => [innerElementName, i, path].join('.')))
      if(!linkedInnerElement) {
        innerElements.push(innerElement)
        continue
      }
      const replacementElement = mergeElements(subElement, linkedInnerElement, parseData)
      setAtPath(innerElement, subElementPath, replacementElement)
      innerElements.push(innerElement)
    }
  }
}

function findElementName(elementNameOrFilter: string | ElementNameFilter, elementId: string, parseData: ParseData): string {
  const elementNames = typeof elementNameOrFilter === 'string' ? [ elementNameOrFilter ] : elementNameOrFilter(parseData)
  return findElementNameForId(elementNames, elementId, parseData.elements)
}

function findInnerElement(element: any, paths: string[]): [string, any] {
  for(const path of paths) {
    const innerElement = getAtPath(element, path)
    if(innerElement !== null && innerElement !== undefined) {
      return [ path, innerElement ]
    }
  }
  return [ '', null ]
}
