import { ParseData } from '../parse-data'

export type ElementNameFilter = (parseData: ParseData) => string[]

export function join(...filters: ElementNameFilter[]): ElementNameFilter {
  return (parseData: ParseData): string[] => {
    const names = new Set(...filters.map(filter => filter(parseData)))
    return [ ...names.values() ]
  }
}

export function startsWith(startsWith: string): ElementNameFilter {
  let elementNames: string[]
  return (parseData: ParseData): string[] => {
    if(!elementNames) {
      elementNames = [ ...parseData.elements.keys() ].filter(key => key.startsWith(startsWith))
    }

    return elementNames
  }
}

export function inList(...list: string[]): ElementNameFilter {
  return (parseData: ParseData): string[] => {
    return list
  }
}
