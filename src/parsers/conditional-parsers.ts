import {
  getElementName,
} from '../element'
import { ParseData } from '../parse-data'
import { LOGGER } from '../logger'
import { ElementParser, ParseContext } from './'

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

export function outerElementHasName(outerElementName: string) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    return getElementName(outerElement) === outerElementName
  }
}
