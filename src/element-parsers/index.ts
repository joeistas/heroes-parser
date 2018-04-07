import * as casclib from 'casclib'

import { ElementMap } from '../element-map'
import {
  ElementParser,
  ELEMENT_ATTRIBUTE_KEY,
  ELEMENT_NAME_KEY,
  getElementId,
  getElementName,
  getElementFunction,
  copyElement,
  mergeWithParent,
} from '../element'
import { ParseData } from '../parser'
import { ElementNameFilter } from './filters'

export * from './add'
export * from './assets'
export * from './filters'
export * from './merge'
export * from './text'

export function joinParsers(...processors: ElementParser[]) {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    return processors.reduce((e, processor) => processor(e, containingElement, parseData), element)
  }
}

function hasIdBeenSeen(element: any, idsSeen: Set<string>) {
  return idsSeen.has(getElementId(element))
}

function addSeenId(element: any, idsSeen: Set<string>) {
  const elementId = getElementId(element)
  if(elementId) {
    idsSeen.add(elementId)
  }
}

export function preParseElement(element: any, outerElement: any, elementName: string, parseData: ParseData) {
  element = mergeWithParent(element, elementName, parseData)
  element[ELEMENT_NAME_KEY] = elementName

  const func = getElementFunction(elementName, parseData.functions, 'preParse') as ElementParser
  return func ? func(element, outerElement, parseData) : element
}

export function parseInnerElements(element: any, outerElement: any, elementName: string, parseData: ParseData, idsSeen: Set<string>) {
  for(const name of Object.keys(element)) {
    if([ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY].includes(name)) {
      continue
    }

    element[name] = element[name].map((innerElement: any) => parseElement(innerElement, element, name, parseData, new Set(idsSeen)))
  }

  return element
}

export function postParseElement(element: any, outerElement: any, elementName: string, parseData: ParseData) {
  const func = getElementFunction(elementName, parseData.functions, 'postParse') as ElementParser
  return func ? func(element, outerElement, parseData) : element
}

export function parseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, idsSeen: Set<string> = new Set()) {
  const elementId = getElementId(element)
  if(hasIdBeenSeen(element, idsSeen)) {
    return element
  }

  addSeenId(element, idsSeen)

  elementName = getElementName(element) || elementName
  element = copyElement(element)

  const parsedElement = preParseElement(element, outerElement, elementName, parseData)
  element = hasIdBeenSeen(parsedElement, idsSeen) ? element : parsedElement
  addSeenId(element, idsSeen)

  element = parseInnerElements(element, outerElement, elementName, parseData, idsSeen)

  return postParseElement(element, outerElement, elementName, parseData)
}
