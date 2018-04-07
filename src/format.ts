import * as pluarlize from 'pluralize'

import {
  ElementFormatter,
  ElementKeyFormatter,
  ElementArrayFormatter,
  ELEMENT_NAME_KEY,
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  getElementFunction,
  getElementName,
} from './element'
import { ParseData } from './parser'

export function formatElement(element: any, outerElement: any, parseData: ParseData): any {
  const formattedElement: any = {}

  formatAttributes(formattedElement, element)

  for(const key of Object.keys(element)) {
    if([ ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY ].includes(key)) {
      continue
    }
    const formatKeyFunction = getElementFunction(key, parseData.functions, 'formatKey') as ElementKeyFormatter
    const formattedKey = formatKeyFunction ? formatKeyFunction(key) : key
    const innerElements = element[key].map((e: any) => formatElement(e, formattedElement, parseData))
      .filter((e: any) => !!e)

    const formatListFunction = getElementFunction(key, parseData.functions, 'formatArray') as ElementArrayFormatter
    const formattedList = formatListFunction ? formatListFunction(innerElements) : innerElements
    if(formattedList === null) {
      continue
    }

    if(formattedList.mergeOntoOuterElement) {
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

export function defaultFormatKey(key: string): string {
  key = key.replace('Array', '')
  return key[0].toLowerCase() + key.substring(1)
}

export function defaultFormatArray(elements: any[]): any {
  if(elements.length === 0) {
    return null
  }

  return elements
}

export function pluarlizeKey(key: string) {
  return pluarlize(key)
}

export function joinKeyFormatters(...formatters: ElementKeyFormatter[]): ElementKeyFormatter {
  return (key: string): string => {
    let formattedKey = key
    for(const formatter of formatters) {
      formattedKey = formatter(formattedKey)
      if(formattedKey === null) {
        return key
      }
    }

    return formattedKey
  }
}

export function joinElementFormatters(...formatters: ElementFormatter[]): ElementFormatter {
  return (formattedElement: any, element: any): string => {
    for(const formatter of formatters) {
      formattedElement = formatter(formattedElement, element)
      if(formattedElement === null) {
        return null
      }
    }

    return formattedElement
  }
}

export function valueFromAttribute(attribute: string = 'value'): ElementFormatter {
  return (formattedElement: any, element: any): string => {
    return formattedElement[attribute]
  }
}

export function valueToBoolean(trueValue: string = '1', falseValue: string = '0'): ElementFormatter {
  return (formattedElement: any, element: any): any => {
    if(formattedElement === trueValue) {
      return true
    }

    if(formattedElement === falseValue) {
      return false
    }

    return formattedElement
  }
}

export function valueToNumber(formattedElement: any, element: any): any {
  const value = parseInt(formattedElement)

  return Number.isNaN(value) ? formattedElement : value
}

export function splitOnCaps(formattedElement: any, element: any): any {
  return formattedElement.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
}

export function attributeToBoolean(attribute: string = 'value', trueValue: string = '1', falseValue: string = '0') {
  return (formattedElement: any, element: any): any => {
    formattedElement[attribute] = valueToBoolean(trueValue, falseValue)(formattedElement[attribute], element)
    return formattedElement
  }
}

export function attributeToNumber(attribute: string = 'value') {
  return (formattedElement: any, element: any): any => {
    formattedElement[attribute] = valueToNumber(formattedElement[attribute], element)
    return formattedElement
  }
}

export function formatAttributeAsKey(formatter: ElementKeyFormatter, attribute: string = 'index') {
  return (formattedElement: any, element: any): any => {
    formattedElement[attribute] = formatter(formattedElement[attribute])
    return formattedElement
  }
}

export function elementToKeyValuePair(keyAttribute: string = 'index', valueAttribute = 'value'): ElementFormatter {
  return (formattedElement: any, element: any): any => {
    return {
      [formattedElement[keyAttribute]]: formattedElement[valueAttribute]
    }
  }
}

export function removeFromOutput(): null {
  return null
}

export function joinElementArrayFormatters(...formatters: ElementArrayFormatter[]): ElementArrayFormatter {
  return (elements: any[]): any => {
    if(elements.length === 0) {
      return null
    }

    return formatters.reduce((e, formatter) => formatter(e), elements)
  }
}

export function reduceToSingleObject(mergeOntoOuterElement: boolean = false): ElementArrayFormatter {
  return (elements: any[]): any => {
    if(elements.length === 0) {
      return null
    }

    const initialObject = mergeOntoOuterElement ? { mergeOntoOuterElement: true } : {}
    return elements.reduce((reduced, element) => Object.assign(reduced, element), initialObject)
  }
}

export function firstValue(elements: any[]): any {
  if(elements.length === 0) {
    return null
  }

  return elements[0]
}

function formatAttributes(formattedElement: any, element: any) {
  const attributes = getElementAttributes(element)
  for(const key of Object.keys(attributes)) {
    const formattedKey = defaultFormatKey(key) || key
    formattedElement[formattedKey] = attributes[key]
  }
}
