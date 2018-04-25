import {
  ElementFormatter,
  ElementKeyFormatter,
} from './'
import * as utils from '../utils'

export type ElementConditional = (formattedElement: any, element: any) => boolean

export function join(...formatters: ElementFormatter[]): ElementFormatter {
  return (formattedElement: any, element: any): any => {
    for(const formatter of formatters) {
      formattedElement = formatter(formattedElement, element)
      if(formattedElement === null) {
        return null
      }
    }

    return formattedElement
  }
}

export function conditionallyFormatElement(
  condition: ElementConditional,
  whenTrue: ElementFormatter = passThrough,
  whenFalse: ElementFormatter = passThrough
): ElementFormatter {
  return (formattedElement: any, element: any): any => {
    return condition(formattedElement, element) ? whenTrue(formattedElement, element) : whenFalse(formattedElement, element)
  }
}

export function isEmpty(formattedElement: any, element: any): boolean {
  return Object.keys(formattedElement).length === 0
}

export function attributeIsDefined(attribute = 'value'): ElementConditional {
  return (formattedElement: any, element: any): boolean => {
    return formattedElement[attribute] !== null && formattedElement[attribute] !== undefined
  }
}

export function onlyHasKeys(...keys: string[]): ElementConditional {
  return (formattedElement: any, element: any): boolean => {
    const keySet = new Set(Object.keys(formattedElement))
    return keySet.size === keys.length && keys.every(key => keySet.has(key))
  }
}

export function attributeHasValue(attributeValue: string, attribute: string = 'value'): ElementConditional {
  return (formattedElement: any, element: any): boolean => {
    return formattedElement[attribute] && formattedElement[attribute] === attributeValue
  }
}

export function some(...conditionals: ElementConditional[]) {
  return (formattedElement: any, element: any): boolean => {
    return conditionals.some(conditional => conditional(formattedElement, element))
  }
}

export function removeFromOutput(formattedElement: any, element: any): null {
  return null
}

export function passThrough(formattedElement: any, element: any) {
  return formattedElement
}

export const removeIfEmptyObject = conditionallyFormatElement(isEmpty, removeFromOutput)

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
  return utils.splitOnCaps(formattedElement)
}

export function removeFromStart(remove: string) {
  return (formattedElement: any, element: any) => {
    return formattedElement.startsWith(remove) ? formattedElement.substring(remove.length) : formattedElement
  }
}

export function formatCompareOperator(formattedElement: any, element: any) {
  switch(formattedElement.toLowerCase()) {
    case 'eq': return '=='
    case 'ne': return "!="
    case 'gt': return ">"
    case 'ge': return ">="
    case 'lt': return "<"
    case 'le': return "<="
  }
}

export function applyFormatterToAttribute(attribute: string = 'value', formatter: ElementFormatter) {
  return (formattedElement: any, element: any): any => {
    if(!formattedElement[attribute]) {
      return formattedElement
    }

    formattedElement[attribute] = formatter(formattedElement[attribute], null)
    return formattedElement
  }
}

export function attributeToBoolean(attribute: string = 'value', trueValue: string = '1', falseValue: string = '0') {
  return applyFormatterToAttribute(attribute, valueToBoolean(trueValue, falseValue))
}

export function attributeToNumber(attribute: string = 'value') {
  return applyFormatterToAttribute(attribute, valueToNumber)
}

export function removeFromStartOfAttribute(remove: string, attribute: string = 'value') {
  return applyFormatterToAttribute(attribute, removeFromStart(remove))
}

export function formatAttributeWithKeyFormatter(formatter: ElementKeyFormatter, attribute: string = 'index') {
  return applyFormatterToAttribute(attribute, formatter)
}

export function toKeyValuePair(keyAttribute: string = 'index', valueAttribute = 'value'): ElementFormatter {
  return (formattedElement: any, element: any): any => {
    return {
      [formattedElement[keyAttribute]]: formattedElement[valueAttribute]
    }
  }
}

export function parseFilterString(formattedElement: any, element: any) {
  if(typeof formattedElement !== 'string') {
    return formattedElement
  }

  const [ trueFilters, falseFilters ] = formattedElement.split(";")
  const filters: any = {}

  const setFilter = (filter: string, value: boolean) => {
    if(filter.length === 0 || filter === '-') {
      return
    }

    filters[filter] = value
  }

  trueFilters.split(',').forEach((filter: string) => setFilter(filter, true))
  falseFilters.split(',').forEach((filter: string) => setFilter(filter, false))

  return filters
}

export function removeKeyFromElement(key: string): ElementFormatter {
  return (formattedElement: any, element: any): any => {
    delete formattedElement[key]
    return formattedElement
  }
}
