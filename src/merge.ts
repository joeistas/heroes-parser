import { ELEMENT_ATTRIBUTE_KEY, mergeElements, reduceElements } from './element'
import { ParseData} from './parser'

export function defaultMerge(parentElements: any[], childElements: any[], mergedAttributes: any, parseData: ParseData): any[] {
  const elements = [ ...parentElements, ...childElements ]
  const indexedElements = elements.filter(e => e[ELEMENT_ATTRIBUTE_KEY] && !!e[ELEMENT_ATTRIBUTE_KEY].index)
  const unindexed = elements.filter(e => !e[ELEMENT_ATTRIBUTE_KEY] || !e[ELEMENT_ATTRIBUTE_KEY].index)

  return unindexed.concat([ ...new Map(indexedElements.map(e => [e[ELEMENT_ATTRIBUTE_KEY].index, e]) as [string, any][]).values() ])
}

export function singleElement(parentElements: any[], childElements: any[], mergedAttributes: any, parseData: ParseData): any[] {
  const parent = reduceElements(parentElements, parseData)
  const child = reduceElements(childElements, parseData)

  return [ mergeElements(parent, child, parseData) ]
}
