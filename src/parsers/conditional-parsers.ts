import {
  getElementName,
} from '../element'
import { ParseData } from '../parse-data'
import { LOGGER } from '../logger'
import { ElementParser } from './'

export type ParserConditional = (element: any, outerElement: any, parseData: ParseData) => boolean

export function conditionallyParseElement(
  conditional: ParserConditional,
  whenTrue: ElementParser = passThrough,
  whenFalse: ElementParser = passThrough
) {
  return (element: any, outerElement: any, parseData: ParseData): any => {
    return conditional(element, outerElement, parseData) ?
      whenTrue(element, outerElement, parseData) :
      whenFalse(element, outerElement, parseData)
  }
}

export function passThrough(element: any, outerElement: any, parseData: ParseData): any {
  return element
}

export function outerElementHasName(outerElementName: string) {
  return (element: any, outerElement: any, parseData: ParseData): any => {
    return getElementName(outerElement) === outerElementName
  }
}
