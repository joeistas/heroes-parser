import * as deepmerge from 'deepmerge'

import { ElementArrayFormatter } from './'

export type ElementArrayConditional = (elements: any[]) => boolean

export const removeIfEmpty = conditionallyFormatArray(isEmpty, removeArray)
export const defaultArrayFormatter = removeIfEmpty

export function join(...formatters: ElementArrayFormatter[]): ElementArrayFormatter {
  return (elements: any[]): any => {
    if(elements.length === 0) {
      return null
    }

    return formatters.reduce((e, formatter) => formatter(e), elements)
  }
}

export function removeArray(elements: any[]): null {
  return null
}

export function passThrough(elements: any[]): any {
  return elements
}

export function conditionallyFormatArray(
  conditional: ElementArrayConditional,
  whenTrue: ElementArrayFormatter = passThrough,
  whenFalse: ElementArrayFormatter = passThrough
): ElementArrayFormatter {
  return (elements: any[]): any => {
    return conditional(elements) ? whenTrue(elements) : whenFalse(elements)
  }
}

export function isEmpty(elements: any[]): boolean {
  return elements.length === 0
}

export function elementsAreObjects(elements: any[]): boolean {
  return elements.every(element => typeof element === 'object' && element !== null)
}

export function allHaveAttribute(attribute: string = 'index') {
  return(elements: any[]) => {
    return elements.every(element => element[attribute] !== null && element[attribute] !== undefined)
  }
}

export function reduceToSingleObject(mergeOntoOuterElement: boolean = false): ElementArrayFormatter {
  return (elements: any[]): any => {
    if(elements.length === 0) {
      return null
    }

    const initialObject = mergeOntoOuterElement ? { mergeOntoOuterElement: true } : {}
    return deepmerge.all([ initialObject, ...elements ])
  }
}

export function combineBy(indexAttribute = 'index', removeIndexAttribute: boolean = true) {
  return (elements: any[]): any => {
    return elements.reduce((reduced: any, element: any) => {
      const index = element[indexAttribute]
      if(removeIndexAttribute) {
        delete element[indexAttribute]
      }
      reduced[index] = element
      return reduced
    }, {})
  }
}

export function firstValue(elements: any[]): any {
  if(elements.length === 0) {
    return null
  }

  return elements[0]
}

export function lastValue(elements: any[]): any {
  if(elements.length === 0) {
    return null
  }

  return elements[ elements.length - 1 ]
}
