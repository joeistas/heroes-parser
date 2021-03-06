import {
  ELEMENT_NAME_KEY,
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  getElementFunction,
  getElementName,
  getElementId,
  getInnerElementKeys,
} from '../element'
import { ParseData } from '../parse-data'
import { defaultKeyFormatter } from './key-formatters'
import { getLogger } from '../logger'

export type ElementFormatter = (formattedElement: any, element: any) => any
export type ElementKeyFormatter = (key: string) => string
export type ElementArrayFormatter = (elements: any[]) => any

/** @hidden */
export function formatElement(element: any, outerElement: any, parseData: ParseData): any {
  const formattedElement: any = {}
  const elementName = getElementName(element)
  const elementId = getElementId(element)
  const logger = getLogger()

  logger.debug(`Formatting elementName: ${ elementName } id: ${ elementId }`)
  formatAttributes(formattedElement, element)

  logger.debug(`Formatting inner elements of elementName: ${ elementName } id: ${ elementId }`)
  for(const key of getInnerElementKeys(element)) {
    logger.debug(`Formatting key: ${ key }`)
    const formatKeyFunction = getElementFunction(key, parseData.functions, 'formatKey')
    let formattedKey = key
    if(typeof formatKeyFunction === 'string') {
      formattedKey = formatKeyFunction
    }
    else if(formatKeyFunction) {
      formattedKey = (formatKeyFunction as ElementKeyFormatter)(key)
    }

    const innerElements = element[key].map((e: any) => formatElement(e, formattedElement, parseData))
      .reduce((flattened: any[], array: any) => flattened.concat(array), [])
      .filter((e: any) => !!e)


    logger.debug(`Formatting array for key: ${ key }`)
    const formatArrayFunction = getElementFunction(key, parseData.functions, 'formatArray') as ElementArrayFormatter
    const formattedList = formatArrayFunction ? formatArrayFunction(innerElements) : innerElements
    if(formattedList === null) {
      continue
    }

    if(formattedList.mergeOntoOuterElement) {
      logger.debug(`Merging values for ${ key } onto elementName: ${ elementName } id: ${ elementId }`)
      delete formattedList.mergeOntoOuterElement
      Object.assign(formattedElement, formattedList)
    }
    else {
      formattedElement[formattedKey] = formattedList
    }

  }

  const func = getElementFunction(getElementName(element), parseData.functions, 'formatElement') as ElementFormatter
  return func ? func(formattedElement, element) : formattedElement
}

function formatAttributes(formattedElement: any, element: any) {
  const attributes = getElementAttributes(element)
  for(const key of Object.keys(attributes)) {
    const formattedKey = defaultKeyFormatter(key) || key
    formattedElement[formattedKey] = attributes[key]
  }
}
