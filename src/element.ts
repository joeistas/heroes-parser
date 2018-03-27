import { ElementMap } from './element-map'
import { ParseData } from './parser'
import { filterKeysFromObject } from './utils'

export const ATTRIBUTE_BLACKLIST: string[] = [ 'default' ]
export const ELEMENT_ATTRIBUTE_KEY: string = '$'

export type ElementMerger = (parentElements: any[], childElements: any[], mergedAttributes: any) => any[]
export type ElementProcessor = (element: any, containingElement: any, storageHandle: any, parseData: ParseData) => Promise<any>
export type ElementFormatter = (element: any) => any

export interface ElementFunctions {
  merge?: ElementMerger
  process?: ElementProcessor
  format?: ElementFormatter
}

export type ElementFunctionsMap = { [elementName: string]: ElementFunctions }

export function getElementFunction(elementName: string, functions: ElementFunctionsMap, functionName: keyof ElementFunctions) {
  if(functions[elementName] && functions[elementName][functionName]) {
    return functions[elementName][functionName]
  }

  return functions.default[functionName]
}

export function getElementAttributes(element: any) {
  return element[ELEMENT_ATTRIBUTE_KEY] || {}
}

export function getElementId(element: any) {
  return getElementAttributes(element).id
}

export function getElement(elementId: string, elementName: string, elementMap: ElementMap) {
  const elements = elementMap.get(elementName)
  if(!elements) {
    return []
  }

  return elements.get(elementId) || []
}

export function copyElement(element: any): any {
  const copy = { [ELEMENT_ATTRIBUTE_KEY]: Object.assign({}, element[ELEMENT_ATTRIBUTE_KEY]) }

  for(const key of Object.keys(element)) {
    if(key === ELEMENT_ATTRIBUTE_KEY) {
      continue
    }

    copy[key] = [ ...element[key] ]
  }

  return copy
}

export function mergeWithParent(element: any, elementName: string, parseData: ParseData) {
  if(!getElementId(element)) {
    return element
  }

  const parentId = getElementAttributes(element).parent || ''
  let parent = reduceElements(getElement(parentId, elementName, parseData.elements), parseData)
  parent = mergeWithParent(parent, elementName, parseData)

  return mergeElements(parent, element, parseData)
}

export function mergeAttributes(parent: any, child: any, filters: string[] = ATTRIBUTE_BLACKLIST) {
  const parentAttributes = getElementAttributes(parent)
  const childAttributes = getElementAttributes(child)

  const attributes = Object.assign({}, parentAttributes, childAttributes)
  return filterKeysFromObject(attributes, filters)
}

export function reduceElements(elements: any[], parseData: ParseData) {
  return elements.reduce((result, e) => mergeElements(result, e, parseData), {})
}

export function mergeElements(parent: any, child: any, parseData: ParseData) {
  const elementSet = new Set([ ...Object.keys(parent), ...Object.keys(child) ])
  const mergedElement: any = { [ELEMENT_ATTRIBUTE_KEY]: mergeAttributes(parent, child) }

  for(const elementName of elementSet) {
    if(elementName === ELEMENT_ATTRIBUTE_KEY) {
      continue
    }

    const func = getElementFunction(elementName, parseData.functions, 'merge') as ElementMerger
    if(func) {
      mergedElement[elementName] = func(parent[elementName] || [], child[elementName] || [], getElementAttributes(mergedElement))
    }
  }
  return mergedElement
}

export async function parseElement(element: any, containingElement: any, elementName: string, storageHandle: any, parseData: ParseData) {
  element = mergeWithParent(element, elementName, parseData)

  const processFunc = getElementFunction(elementName, parseData.functions, 'process') as ElementProcessor
  element = processFunc ? await processFunc(element, containingElement, storageHandle, parseData) : element

  const processedElement: any = { [ELEMENT_ATTRIBUTE_KEY]: mergeAttributes({}, element) }

  for(const name of Object.keys(element)) {
    if(name === ELEMENT_ATTRIBUTE_KEY) {
      continue
    }

    processedElement[name] = await Promise.all(element[name].map((e: any) => parseElement(e, element, name, storageHandle, parseData)))
  }

  return processedElement
}
