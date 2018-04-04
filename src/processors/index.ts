export * from './asset'

import * as casclib from 'casclib'

import { ElementMap } from '../element-map'
import {
  ElementMerger,
  ELEMENT_ATTRIBUTE_KEY,
  ATTRIBUTE_BLACKLIST,
  getElementAttributes,
  getElement,
  getElementFunction,
  findElementNameForId,
  reduceElements,
  mergeElements,
  mergeAttributes,
  copyElement,
  processElement,
  ElementProcessor
} from '../element'
import { ParseData } from '../parser'

const REPLACEMENT_REGEXP = /(##([^#]+)##)/

export type ElementNameFilter = (parseData: ParseData) => string[]

export function startsWith(startsWith: string): ElementNameFilter {
  let elementNames: string[]
  return (parseData: ParseData) => {
    if(!elementNames) {
      elementNames = [ ...parseData.elements.keys() ].filter(key => key.startsWith(startsWith))
    }

    return elementNames
  }
}

export function inList(list: string[]): ElementNameFilter {
  return (parseData: ParseData) => {
    return list
  }
}

export function replaceElement(elementNameOrFilter: string | ElementNameFilter, attribute: string = 'value'): ElementProcessor {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    if(attributes[attribute] === undefined) {
      return element
    }

    const elementNames = typeof elementNameOrFilter === 'string' ? [ elementNameOrFilter ] : elementNameOrFilter(parseData)
    const elementName = findElementNameForId(elementNames, attributes[attribute], parseData.elements)
    if(!elementName) {
      console.log('replaceElement: not found', attributes[attribute], element)
      return element
    }

    let replacementElement = reduceElements(getElement(attributes[attribute], elementName, parseData.elements), parseData)
    replacementElement = mergeElements(element, replacementElement, parseData)

    return processElement(replacementElement, containingElement, elementName, parseData)
  }
}

export function replaceText(...attributes: string[]): ElementProcessor {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const values = mergeAttributes(containingElement, element)

    for(const attribute of attributes) {
      const value = getElementAttributes(element)[attribute]
      const match = REPLACEMENT_REGEXP.exec(value)
      if(!match) {
        continue
      }
      element[ELEMENT_ATTRIBUTE_KEY][attribute] = value.replace(match[1], values[match[2]])
    }
    return element
  }
}

export function processText(attribute: string = 'value'): ElementProcessor {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const elementAttributes = getElementAttributes(element)
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

export function addAttribute(name: string, value: string, override: boolean = false) {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    attributes[name] = override || !attributes[name] ? value : attributes[name]

    return element
  }
}

export function addInnerElement(elementNameOrFilter: string | ElementNameFilter, attribute: string = 'value'): ElementProcessor {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const attributes = getElementAttributes(element)
    const elementNames = typeof elementNameOrFilter === 'string' ? [ elementNameOrFilter ] : elementNameOrFilter(parseData)

    const elementName = findElementNameForId(elementNames, attributes[attribute], parseData.elements)
    const innerElement = reduceElements(getElement(attributes[attribute], elementName, parseData.elements), parseData)

    const innerElements = element[elementName] || []
    const mergeFunction = getElementFunction(elementName, parseData.functions, "merge") as ElementMerger
    element[elementName] = mergeFunction ?
      mergeFunction(innerElements, [ innerElement ], getElementAttributes(element)) :
      [ ...innerElements, innerElement ]

    return element
  }
}

export function joinProcessors(...processors: ElementProcessor[]) {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    return processors.reduce((e, processor) => processor(e, containingElement, parseData), element)
  }
}
