import * as casclib from 'casclib'

import { ElementMap } from '../element-map'
import {
  ELEMENT_ATTRIBUTE_KEY,
  ELEMENT_NAME_KEY,
  getElementId,
  getElementName,
  getElementFunction,
  getElementAttributes,
  copyElement,
  mergeWithParent,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementNameFilter } from './element-name-filters'
import { LOGGER } from '../logger'

export type ElementParser = (element: any, outerElement: any, parseData: ParseData, context: ParseContext) => any
export type ParseContext = { [attribute: string]: string }

export function join(...processors: ElementParser[]) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    return processors.reduce((e, processor) => processor(e, outerElement, parseData, context), element)
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

export function preParseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext) {
  element = mergeWithParent(element, elementName, parseData)
  element[ELEMENT_NAME_KEY] = elementName

  const func = getElementFunction(elementName, parseData.functions, 'preParse') as ElementParser
  return func ? func(element, outerElement, parseData, context) : element
}

export function parseInnerElements(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext, idsSeen: Set<string>) {
  for(const name of Object.keys(element)) {
    if([ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY].includes(name)) {
      continue
    }

    element[name] = element[name].map((innerElement: any) => parseElement(innerElement, element, name, parseData, context, new Set(idsSeen)))
  }

  return element
}

export function postParseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext) {
  const func = getElementFunction(elementName, parseData.functions, 'postParse') as ElementParser
  return func ? func(element, outerElement, parseData, context) : element
}

export function parseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, context: { [attributeName: string]: string } = {}, idsSeen: Set<string> = new Set()) {
  if(hasIdBeenSeen(element, idsSeen)) {
    return element
  }

  elementName = getElementName(element) || elementName
  element = copyElement(element)

  const elementId = getElementId(element)
  LOGGER.debug(`Preparsing elementName: ${ elementName } id: ${ elementId }`)

  context = Object.assign({}, context, getElementAttributes(element))
  const parsedElement = preParseElement(element, outerElement, elementName, parseData, context)

  element = hasIdBeenSeen(parsedElement, idsSeen) ? element : parsedElement
  addSeenId(element, idsSeen)

  LOGGER.debug(`Preparsing inner elements of elementName: ${ elementName } id: ${ elementId }`)
  context = Object.assign({}, context, getElementAttributes(element))
  element = parseInnerElements(element, outerElement, elementName, parseData, context, idsSeen)

  LOGGER.debug(`Postparsing elementName: ${ elementName } id: ${ elementId }`)
  return postParseElement(element, outerElement, elementName, parseData, context)
}
