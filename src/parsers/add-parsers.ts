import {
  ELEMENT_NAME_KEY,
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  getElementFunction,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementParser, ParseContext } from './'
import { attributeValueReplacement } from './text-parsers'
import { ElementMerger } from '../merge'

export function addAttribute(name: string, value: string, override: boolean = false) {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const attributes = getElementAttributes(element)
    attributes[name] = override || !attributes[name] ? value : attributes[name]

    return element
  }
}

export function addInnerElement(attribute: string, key: string, innerAttribute: string = 'value', innerName?: string): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const attributes = getElementAttributes(element)
    if(!attributes[attribute]) {
      return element
    }

    innerName = innerName || key

    const innerElement = {
      [ELEMENT_ATTRIBUTE_KEY]: { [innerAttribute]: attributes[attribute] },
      [ELEMENT_NAME_KEY]: innerName
    }
    const innerElements = element[key] || []
    const mergeFunction = getElementFunction(key, parseData.functions, "merge") as ElementMerger
    element[key] = mergeFunction ?
      mergeFunction(innerElements, [ innerElement ], getElementAttributes(element), parseData) :
      [ ...innerElements, innerElement ]

    return element
  }
}

export function attributesToInnerElements(regexp: RegExp, innerAttribute = 'value'): ElementParser {
  return (element: any, outerElement: any, parseData: ParseData, context: ParseContext): any => {
    const elementAttributes = getElementAttributes(element)
    Object.keys(elementAttributes).filter(attribute => attribute.match(regexp))
      .forEach(attribute => {
        element = attributeValueReplacement(attribute)(element, outerElement, parseData, context)
        element = addInnerElement(attribute, attribute, innerAttribute)(element, outerElement, parseData, context)
        const attributes = getElementAttributes(element)
        delete attributes[attribute]
      })

    return element
  }
}
