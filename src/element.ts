import { ElementMap } from './element-map'
import { ParseData } from './parse-data'
import { filterKeysFromObject, stringIsNumber } from './utils'
import { ElementParser } from './parsers'
import { ElementMerger } from './merge'
import { ElementKeyFormatter, ElementFormatter, ElementArrayFormatter } from './formatters'

export const ATTRIBUTE_BLACKLIST: string[] = [ 'default' ]
export const ELEMENT_ATTRIBUTE_KEY: string = '$'
export const ELEMENT_NAME_KEY: string = '$elementName'

export interface ElementFunctions {
  merge?: ElementMerger
  preParse?: ElementParser
  postParse?: ElementParser
  formatElement?: ElementFormatter
  formatKey?: ElementKeyFormatter | string
  formatArray?: ElementArrayFormatter
}

export type ElementFunctionsMap = { [elementName: string]: ElementFunctions }

export function buildElement(elementName?: string, attributes: { [index: string]: any } = {}): any {
  const element: any = { [ELEMENT_ATTRIBUTE_KEY]: { ...attributes }}
  if(elementName) {
    element[ELEMENT_NAME_KEY] = elementName
  }

  return element
}

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

export function getElementIndex(element: any) {
  return getElementAttributes(element).index
}

export function getElementName(element: any) {
  return element[ELEMENT_NAME_KEY]
}

export function isCatalogElement(elementName: string): boolean {
  return /^C[A-Z]/.test(elementName)
}

export function getInnerElementKeys(element: any): string[] {
  return Object.keys(element).filter(key => ![ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY].includes(key))
}

export function getElement(elementId: string, elementName: string, elementMap: ElementMap) {
  const elements = elementMap.get(elementName)
  if(!elements) {
    return []
  }

  return elements.get(elementId.toLowerCase()) || []
}

export function findElementNameForId(elementNames: string[], elementId: string, elementMap: ElementMap): string {
  return elementNames.find(name => getElement(elementId, name, elementMap).length > 0)
}

export function findElement(elementNames: string[], elementId: string, elementMap: ElementMap): any {
  const elementName = findElementNameForId(elementNames, elementId, elementMap)
  if(!elementName) {
    return null
  }

  return joinElements(getElement(elementId, elementName, elementMap))
}

export function copyElement(element: any): any {
  const copy = buildElement(getElementName(element), getElementAttributes(element))

  for(const key of getInnerElementKeys(element)) {
    copy[key] = [ ...element[key] ]
  }

  return copy
}

export function findParentName(elementName: string, parseData: ParseData): string {
  let parentClassName = ""
  for(const key of parseData.elements.keys()) {
    if(elementName !== key && elementName.startsWith(key) && key.length > parentClassName.length) {
      parentClassName = key
    }
  }

  return parentClassName
}

export function mergeWithParent(element: any, elementName: string, parseData: ParseData) {
  if(!getElementId(element) && !isCatalogElement(elementName)) {
    return element
  }

  let parentName = elementName
  if(!getElementId(element)) {
    parentName = findParentName(elementName, parseData)
  }

  if(!parentName) {
    return element
  }

  const parentId = getElementAttributes(element).parent || ''
  let parent = joinElements(getElement(parentId, parentName, parseData.elements))
  parent = mergeWithParent(parent, parentName, parseData)

  return mergeElements(parent, element, parseData, ATTRIBUTE_BLACKLIST.concat('parent'))
}

export function mergeAttributes(parent: any, child: any, filters: string[] = ATTRIBUTE_BLACKLIST) {
  const parentAttributes = getElementAttributes(parent)
  const childAttributes = getElementAttributes(child)

  const attributes = Object.assign({}, parentAttributes, childAttributes)
  return filterKeysFromObject(attributes, filters)
}

export function joinElements(elements: any[]) {
  return elements.reduce((joined: any, element: any) => {
    joined[ELEMENT_ATTRIBUTE_KEY] = mergeAttributes(joined, element)
    const elementName = getElementName(element) || joined[ELEMENT_NAME_KEY]
    if(elementName) {
      joined[ELEMENT_NAME_KEY] = elementName
    }

    const keys = new Set([ ...getInnerElementKeys(joined), ...getInnerElementKeys(element) ])
    for(const key of keys) {
      const joinedElements: any[] = joined[key] || []
      joined[key] = joinedElements.concat(element[key] || [])
    }

    return joined
  }, buildElement())
}

export function reduceElements(elements: any[], parseData: ParseData) {
  return elements.reduce((result, e) => mergeElements(result, e, parseData, []), {})
}

export function mergeElements(parent: any, child: any, parseData: ParseData, attributeFilters: string[] = ATTRIBUTE_BLACKLIST) {
  const elementSet = new Set([ ...getInnerElementKeys(parent), ...getInnerElementKeys(child) ])
  const mergedElement: any = buildElement(getElementName(child), mergeAttributes(parent, child, attributeFilters))

  for(const elementName of elementSet) {
    const func = getElementFunction(elementName, parseData.functions, 'merge') as ElementMerger
    if(func) {
      mergedElement[elementName] = func(parent[elementName] || [], child[elementName] || [], getElementAttributes(mergedElement), parseData)
    }
  }
  return mergedElement
}

export function getAtPath(element: any, path: string, parts: string[] = null): any {
  if(element === null || element === undefined) {
    return null
  }

  if(parts === null) {
    parts = path.split('.') || [ path ]
  }
  const part = parts.shift()
  let output = element[part]
  if(output === undefined && Array.isArray(element) && !stringIsNumber(part)) {
    output = element[0]
    output = output === undefined ? null : output[part]
  }

  return parts.length > 0 ? getAtPath(output, path, parts) : getValueFromElement(output)
}

export function getValueFromElement(element: any): any {
  if(element === null || element === undefined) {
    return null
  }

  if(Array.isArray(element)) {
    if(element.length === 0) {
      return null
    }

    element = element[0]
  }

  return (typeof element === 'string' ? element : getElementAttributes(element).value)
}
