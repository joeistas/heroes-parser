import { ElementMap } from './element-map'
import { ParseData } from './parse-data'
import { filterKeysFromObject, stringIsNumber } from './utils'
import { ElementParser } from './parsers'
import { ElementMerger } from './merge'
import { ElementKeyFormatter, ElementFormatter, ElementArrayFormatter } from './formatters'

export const ATTRIBUTE_BLACKLIST: string[] = [ 'default' ]
export const ELEMENT_ATTRIBUTE_KEY: string = '$'
export const ELEMENT_TEXT_KEY: string = '_'
export const ELEMENT_NAME_KEY: string = '$elementName'

/**
  Functions used to parse and format the output of an element type
 */
export interface ElementFunctions {
  /** used to merge parent and child inner elements */
  merge?: ElementMerger
  /** run at the start of element parsing, before inner elements are parsed */
  preParse?: ElementParser
  /** run at the end of element parsing, after inner elements are parsed */
  postParse?: ElementParser
  /** used to format the elmement. Run after attributes and inner elements are formatted */
  formatElement?: ElementFormatter
  /** format the key to be set on outer element */
  formatKey?: ElementKeyFormatter | string
  /** format array of elements */
  formatArray?: ElementArrayFormatter
}

/**
  Map of element functions used for element parsing.
 */
export type ElementFunctionsMap = { [elementName: string]: ElementFunctions }

/**
  Build a new empty element.
 */
export function buildElement(elementName?: string, attributes: { [index: string]: any } = {}): any {
  const element: any = { [ELEMENT_ATTRIBUTE_KEY]: { ...attributes }}
  if(elementName) {
    element[ELEMENT_NAME_KEY] = elementName
  }

  return element
}

/**
  Get function for element name and function name. If the function doesn't exist falls back to the function in `default`
 */
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

/**
  Returns true if the element is a base element. (Exists as a direct child of `Catalog` XML element)
 */
export function isCatalogElement(elementName: string): boolean {
  return /^C[A-Z]/.test(elementName)
}

/**
  Get all of the keys for inner elements of the element. Excludes [[ELEMENT_ATTRIBUTE_KEY]], [[ELEMENT_NAME_KEY]], [[ELEMENT_TEXT_KEY]].
 */
export function getInnerElementKeys(element: any): string[] {
  return Object.keys(element).filter(key => ![ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY, ELEMENT_TEXT_KEY].includes(key))
}

/**
  Get list of elements from element map.
 */
export function getElement(elementId: string, elementName: string, elementMap: ElementMap) {
  const elements = elementMap.get(elementName)
  if(!elements) {
    return []
  }

  return elements.get(elementId.toLowerCase()) || []
}

/**
  Find the first element name in `elementNames` that has `elementId`

  @returns {string} element name
 */
export function findElementNameForId(elementNames: string[], elementId: string, elementMap: ElementMap): string {
  return elementNames.find(name => getElement(elementId, name, elementMap).length > 0)
}

/**
  Find the first element in `elementNames` that has `elementId`

  @returns {string} element name
 */
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

/**
  Find the element name that `elementName` starts with. Used for finding parent class name.

  Example:
    ```
    findParentName("CEffectAbil", parseData)
    ```

    will return:
    ```
    "CEffect"
    ```

  @returns {string} `elementName` parent class name
 */
export function findParentName(elementName: string, parseData: ParseData): string {
  let parentClassName = ""
  for(const key of parseData.elements.keys()) {
    if(elementName !== key && elementName.startsWith(key) && key.length > parentClassName.length) {
      parentClassName = key
    }
  }

  return parentClassName
}

/**
  Merges element with all of its parent elements.
  First merges with element in `parent` attribute. Then checks for default element with no id.
  Then merges with any parent classes found with [[findParentName]]

  @returns merged element
  */
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

/**
  Merges `parent` with `child` attributes. `child` attributes with overrite `parent` attributes.

  @param filters list of attirbutes to remove

  @return merged attributes
 */
export function mergeAttributes(parent: any, child: any, filters: string[] = ATTRIBUTE_BLACKLIST) {
  const parentAttributes = getElementAttributes(parent)
  const childAttributes = getElementAttributes(child)

  const attributes = Object.assign({}, parentAttributes, childAttributes)
  return filterKeysFromObject(attributes, filters)
}

/**
  Joins `elements` into a single element. Inner elements are concatted together.

  @return joined element
 */
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

/**
  Reduces `elements` into a single element by merging all elements.

  @return reduced element
 */
export function reduceElements(elements: any[], parseData: ParseData) {
  return elements.reduce((result, e) => mergeElements(result, e, parseData, []), {})
}

/**
  Merges parent into child. Inner elements are merged with their `merge` functions

  @return merge element
 */
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

/**
  Get the element at path.

  @param path string containing path to access in the element. All parts are separated by `.`
  @param parts **internal use only**
  @returns element at path or `null` if path is not valid
 */
export function getElementAtPath(element: any, path: string, parts: string[] = null): any {
  if(element === null || element === undefined) {
    return null
  }

  if(parts === null) {
    parts = path.split('.')
  }
  const part = parts.shift()
  let output = element[part]
  if(output === undefined && Array.isArray(element) && !stringIsNumber(part)) {
    output = element[0]
    output = output === undefined ? null : output[part]
  }

  if(output === undefined) {
    return null
  }

  if(parts.length === 0) {
    return output
  }

  return getElementAtPath(output, path, parts)
}

/**
  Get value at path. If the last part of the path is an attribute the function will return the value of the element.
  If the value at the end of the path is an element the value in the `value` attribute will be returned.
  If the value at the end of the path is an array the value from the first element in the array will be returned.

  @param path string containing path to access in the element. All parts are separated by `.`
  @returns value at path or `null` if path is not valid
 */
export function getValueAtPath(element: any, path: string): any {
  let attribute = 'value'
  let value = getElementAtPath(element, path)

  if(value === null) {
    const parts = path.split('.')
    attribute = parts.pop()
    value = getElementAtPath(element, path, parts)
  }

  return getValueFromElement(value, attribute)
}

/**
  Get value in elmeent.
  If element is an array with get value from the first element in the array.

  @param attribute attribute to get value from element
  @returns value at path or `null` if path is not valid
 */
export function getValueFromElement(element: any, attribute: string = 'value'): any {
  if(element === null || element === undefined) {
    return null
  }

  if(Array.isArray(element)) {
    if(element.length === 0) {
      return null
    }

    element = element[0]
  }

  return (typeof element === 'string' ? element : getElementAttributes(element)[attribute])
}
