import {
  getElementName,
} from '../element'
import { ParseData } from '../parse-data'
import { LOGGER } from '../logger'
import { ElementParser, ParseContext } from './'
import { ElementNameFilter } from './element-name-filters'
import { getAtPath } from '../utils'
export type ParserConditional = (element: any, outerElement: any, parseData: ParseData, context: ParseContext) => boolean

export function conditionallyParseElement(
  conditional: ParserConditional,
  whenTrue: ElementParser = passThrough,
  whenFalse: ElementParser = passThrough
) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    return conditional(element, outerElement, parseData, context) ?
      whenTrue(element, outerElement, parseData, context) :
      whenFalse(element, outerElement, parseData, context)
  }
}

export function passThrough(element: any, outerElement: any, parseData: ParseData, context: ParseContext): any {
  return element
}

export function outerElementHasName(outerElementNameOrFilter: ElementNameFilter | string) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const outerElementName = getElementName(outerElement)
    if(typeof outerElementNameOrFilter === 'string') {
      return outerElementName === outerElementNameOrFilter
    }
    
    const elementNames = outerElementNameOrFilter(parseData)
    return elementNames.includes(outerElementName)
  }
}

export function pathHasValue(path: string, value: any): ParserConditional {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const pathValue = getAtPath(element, path)

    return pathValue !== null && pathValue === value
  }
}
