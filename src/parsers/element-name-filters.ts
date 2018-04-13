import { ParseData } from '../parser'

export type ElementNameFilter = (parseData: ParseData) => string[]

export function startsWith(startsWith: string): ElementNameFilter {
  let elementNames: string[]
  return (parseData: ParseData) => {
    if(!elementNames) {
      elementNames = [ ...parseData.elements.keys() ].filter(key => key.startsWith(startsWith))
    }

    return elementNames
  }
}

export function inList(list: string[]): ElementNameFilter {
  return (parseData: ParseData) => {
    return list
  }
}
