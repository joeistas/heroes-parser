import * as casclib from 'casclib'

import { ElementMap } from './element-map'
import {
  ELEMENT_ATTRIBUTE_KEY,
  ATTRIBUTE_BLACKLIST,
  getElementAttributes,
  getElement,
  reduceElements,
  mergeElements,
  mergeAttributes,
  copyElement,
  parseElement,
  ElementProcessor
} from './element'
import { ParseData } from './parser'

const REPLACEMENT_REGEXP = /(##([^#]+)##)/

export function processAsset(attribute: string = 'value'): ElementProcessor {
  return (element: any, containingElement: any, storageHandle: any, parseData: ParseData): Promise<any> => {
    return casclib.findFiles(storageHandle, element.$[attribute])
      .then(findResults => {
        const attributes = mergeAttributes({}, element)
        if(findResults.length > 0) {
          attributes[attribute] = findResults[0].fullName
        }

        return mergeElements(element, { [ELEMENT_ATTRIBUTE_KEY]: attributes }, parseData)
      })
  }
}

export function replaceElement(elementName: string, attribute: string = 'value', mergeElementAttributes: boolean = true): ElementProcessor {
  return (element: any, containingElement: any, storageHandle: any, parseData: ParseData): Promise<any> => {
    const attributes = getElementAttributes(element)
    const replacementElement = reduceElements(getElement(attributes[attribute], elementName, parseData.elements), parseData)
    replacementElement[ELEMENT_ATTRIBUTE_KEY] = mergeAttributes(element, replacementElement, ATTRIBUTE_BLACKLIST.concat(attribute))
    console.log(attribute, replacementElement[ELEMENT_ATTRIBUTE_KEY])
    return parseElement(replacementElement, containingElement, elementName, storageHandle, parseData)
  }
}

export function replaceText(...attributes: string[]): ElementProcessor {
  return (element: any, containingElement: any, storageHandle: any, parseData: ParseData): Promise<any> => {
    const values = mergeAttributes(element, containingElement)
    const newElement = copyElement(element)

    for(const attribute of attributes) {
      const value = getElementAttributes(element)[attribute]
      const match = REPLACEMENT_REGEXP.exec(value)
      newElement[attribute] = value.replace(match[1], values[match[2]])
    }

    return Promise.resolve(newElement)
  }
}

export function processText(attribute: string = 'value'): ElementProcessor {
  return (element: any, containingElement: any, storageHandle: any, parseData: ParseData): Promise<any> => {
    const elementAttributes = getElementAttributes(element)
    const localeText = parseData.text.get(elementAttributes[attribute])
    const textObject = [ ...localeText.entries() ].reduce((reduced: any, [key, value]) => {
      reduced[key] = value
      return reduced
    }, {})

    const attributes = Object.assign({}, elementAttributes, { [attribute]: textObject })
    return Promise.resolve(mergeElements(element, { [ELEMENT_ATTRIBUTE_KEY]: attributes }, parseData))
  }
}

export function joinProcessors(...processors: ElementProcessor[]) {
  return async (element: any, containingElement: any, storageHandle: any, parseData: ParseData): Promise<any> => {
    for(const processor of processors) {
      element = await processor(element, containingElement, storageHandle, parseData)
    }

    return element
  }
}
