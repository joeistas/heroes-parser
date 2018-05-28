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
  getInnerElementKeys
} from '../element'
import { ParseData } from '../parse-data'
import { ElementNameFilter } from './element-name-filters'
import { attributesToInnerElements } from './add-parsers'
import { getLogger } from '../logger'

export type ElementParser = (element: any, outerElement: any, parseData: ParseData, context: ParseContext) => any
export interface ParseContext {
  attributes: { [attributeName: string]: string }
  [index: string]: any
}

export const defaultPreParser = attributesToInnerElements(/^[A-Z]/)

export function join(...processors: ElementParser[]) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    return processors.reduce((e, processor) => processor(e, outerElement, parseData, context), element)
  }
}

export function rebuildContext(context: ParseContext, element: any): ParseContext {
  return {
    ...context,
    attributes: {
      ...context.attributes,
      ...getElementAttributes(element),
    }
  }
}

function hasIdBeenSeen(element: any, idsSeen: Set<string>) {
  return idsSeen.has(`${ getElementName(element) }::${ getElementId(element)}`)
}

function addSeenId(element: any, idsSeen: Set<string>) {
  const elementId = getElementId(element)
  const elementName = getElementName(element)
  if(elementId && elementName) {
    idsSeen.add(`${ elementName }::${ elementId }`)
  }
}

export function preParseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext) {
  element = mergeWithParent(element, elementName, parseData)
  element[ELEMENT_NAME_KEY] = elementName

  const func = getElementFunction(elementName, parseData.functions, 'preParse') as ElementParser
  return (func ? func(element, outerElement, parseData, context) : element)
}

export function parseInnerElements(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext, idsSeen: Set<string>) {
  for(const name of getInnerElementKeys(element)) {
    element[name] = element[name].map((innerElement: any) => parseElement(innerElement, element, name, parseData, context, new Set(idsSeen)))
  }

  return element
}

export function postParseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext) {
  const func = getElementFunction(elementName, parseData.functions, 'postParse') as ElementParser
  return func ? func(element, outerElement, parseData, context) : element
}

export function parseElement(element: any, outerElement: any, elementName: string, parseData: ParseData, context: ParseContext = { attributes: {} }, idsSeen: Set<string> = new Set()) {
  if(hasIdBeenSeen(element, idsSeen)) {
    return element
  }
  const logger = getLogger()

  elementName = getElementName(element) || elementName
  element = copyElement(element)

  const elementId = getElementId(element)
  logger.debug(`Preparsing elementName: ${ elementName } id: ${ elementId }`)

  context = rebuildContext(context, element)
  const parsedElement = preParseElement(element, outerElement, elementName, parseData, context)

  element = hasIdBeenSeen(parsedElement, idsSeen) ? element : parsedElement
  elementName = getElementName(element)
  addSeenId(element, idsSeen)

  logger.debug(`Preparsing inner elements of elementName: ${ elementName } id: ${ elementId }`)
  context = rebuildContext(context, element)
  element = parseInnerElements(element, outerElement, elementName, parseData, context, idsSeen)

  logger.debug(`Postparsing elementName: ${ elementName } id: ${ elementId }`)
  return postParseElement(element, outerElement, elementName, parseData, context)
}
