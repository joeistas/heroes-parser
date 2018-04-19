import { ELEMENT_ATTRIBUTE_KEY, mergeElements, copyElement, reduceElements, getElementIndex } from './element'
import { ParseData } from './parse-data'
import { stringIsNumber } from './utils'

export type ElementMerger = (parentElements: any[], childElements: any[], mergedAttributes: any, parseData: ParseData) => any[]

export function defaultMerge(parentElements: any[], childElements: any[], mergedAttributes: any, parseData: ParseData): any[] {
  const elements = [ ...parentElements, ...childElements ]
  const parentIndexedElements = parentElements.filter(isElementIndexed)
  const childIndexedElements = childElements.filter(isElementIndexed)
  const childStringIndexed = childIndexedElements.filter(elementHasStringIndex)
  const unindexed = elements.filter(isElementUnindexed)
  childIndexedElements.filter(elementHasNumberIndex).forEach(element => {
    element = copyElement(element)
    const index = getElementIndex(element)
    if(index > unindexed.length - 1) {
      childStringIndexed.push(element)
      return
    }
    
    delete element[ELEMENT_ATTRIBUTE_KEY].index
    unindexed[index] = element
  })

  const indexedElements = [ ...parentIndexedElements, ...childStringIndexed ]
  return unindexed.concat([ ...new Map(indexedElements.map(e => [ getElementIndex(e), e ]) as [string, any][]).values() ])
}

export function singleElement(parentElements: any[], childElements: any[], mergedAttributes: any, parseData: ParseData): any[] {
  return [ reduceElements(parentElements.concat(childElements), parseData) ]
}

function isElementIndexed(element: any): boolean {
  return !!getElementIndex(element)
}

function isElementUnindexed(element: any): boolean {
  return !getElementIndex(element)
}

function elementHasNumberIndex(element: any): boolean {
  return stringIsNumber(getElementIndex(element))
}

function elementHasStringIndex(element: any): boolean {
  return !elementHasNumberIndex(element)
}
