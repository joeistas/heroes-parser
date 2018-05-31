import { getElementAttributes, joinElements, mergeWithParent, getElement } from './element'
import { saveJSON } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { parseElement } from './parsers'
import { formatElement } from './formatters'
import { buildLogger, getLogger } from './logger'
import { ParseData, buildParseData } from './parse-data'

/**
  get initial elements from `parseData`

  @returns list of elements
 */
export function initialElements(parseData: ParseData) {
  const options = parseData.options
  if(options.parseElementName && options.parseElementName !== options.rootElementName) {
    return innerRootElements(parseData)
  }

  return rootElements(parseData)
}

/** @hidden */
export function innerRootElements(parseData: ParseData) {
  const options = parseData.options
  const rootElement = mergeWithParent(
    joinElements(getElement(options.rootElementId, options.rootElementName, parseData.elements)),
    options.rootElementName,
    parseData
  )

  return rootElement[options.parseElementName]
}

/** @hidden */
export function rootElements(parseData: ParseData) {
  const rootElements = parseData.elements.get(parseData.options.rootElementName) || new Map()
  return [ ...rootElements.values() ].map(elements => joinElements(elements))
    .filter(element => {
      const attributes = getElementAttributes(element)
      return attributes.default != '1' && !!attributes.id
    })
}

/**
  Parse and format elements in `elementList`

  @returns json from parsed elements
 */
export function parseElements(elementName: string, elementList: any[], parseData: ParseData): any[] {
  const logger = getLogger()
  const parsedElements: any[] = []

  const elementCount = elementList.length

  elementList.forEach((element, index) => {
    const attributes = getElementAttributes(element)
    const name = attributes.id || attributes.value || attributes.Mount
    logger.info(`Building JSON for ${ name } ${ index + 1 }/${ elementCount }`)
    logger.group('info')

    logger.info(`Parsing ${ name }`)
    element = parseElement(element, null, elementName, parseData)

    logger.info(`Formatting ${ name }`)
    parsedElements.push(formatElement(element, null, parseData))
    logger.groupEnd('info')
  })

  return parsedElements
}
