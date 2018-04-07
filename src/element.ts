import { ElementMap } from './element-map'
import { ParseData } from './parser'
import { filterKeysFromObject } from './utils'

export const ATTRIBUTE_BLACKLIST: string[] = [ 'default' ]
export const ELEMENT_ATTRIBUTE_KEY: string = '$'
export const ELEMENT_NAME_KEY: string = '$elementName'

export type ElementMerger = (parentElements: any[], childElements: any[], mergedAttributes: any, parseData: ParseData) => any[]
export type ElementParser = (element: any, outerElement: any, parseData: ParseData) => any
export type ElementFormatter = (formattedElement: any, element: any) => any
export type ElementKeyFormatter = (key: string) => string
export type ElementArrayFormatter = (elements: any[]) => any

export interface ElementFunctions {
  merge?: ElementMerger
  preParse?: ElementParser
  postParse?: ElementParser
  formatElement?: ElementFormatter
  formatKey?: ElementKeyFormatter
  formatArray?: ElementArrayFormatter
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

export function getElementName(element: any) {
  return element[ELEMENT_NAME_KEY]
}

export function getElement(elementId: string, elementName: string, elementMap: ElementMap) {
  const elements = elementMap.get(elementName)
  if(!elements) {
    return []
  }

  return elements.get(elementId) || []
}

export function findElementNameForId(elementNames: string[], elementId: string, elementMap: ElementMap): string {
  return elementNames.find(name => getElement(elementId, name, elementMap).length > 0)
}

export function copyElement(element: any): any {
  const copy = {
    [ELEMENT_ATTRIBUTE_KEY]: Object.assign({}, element[ELEMENT_ATTRIBUTE_KEY]),
    [ELEMENT_NAME_KEY]: getElementName(element),
  }

  for(const key of Object.keys(element)) {
    if([ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY].includes(key)) {
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

  return mergeElements(parent, element, parseData, ATTRIBUTE_BLACKLIST.concat('parent'))
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

export function mergeElements(parent: any, child: any, parseData: ParseData, attributeFilters: string[] = ATTRIBUTE_BLACKLIST) {
  const elementSet = new Set([ ...Object.keys(parent), ...Object.keys(child) ])
  const mergedElement: any = {
    [ELEMENT_ATTRIBUTE_KEY]: mergeAttributes(parent, child, attributeFilters),
    [ELEMENT_NAME_KEY]: getElementName(child)
  }

  for(const elementName of elementSet) {
    if([ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY].includes(elementName)) {
      continue
    }

    const func = getElementFunction(elementName, parseData.functions, 'merge') as ElementMerger
    if(func) {
      mergedElement[elementName] = func(parent[elementName] || [], child[elementName] || [], getElementAttributes(mergedElement), parseData)
    }
  }
  return mergedElement
}
