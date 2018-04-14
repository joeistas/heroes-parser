import { getElementAttributes, reduceElements } from './element'
import { saveJSON } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { parseElement } from './parsers'
import { formatElement } from './formatters'
import { LOGGER, buildLogger } from './logger'
import { ParseData, buildParseData } from './parse-data'

export async function parse(options: Partial<ParseOptions> = {}): Promise<any[]> {
  const parseOptions = buildParseOptions(options)
  buildLogger(parseOptions)
  const parseData = await buildParseData(parseOptions)

  LOGGER.info(`Building JSON for ${ parseOptions.rootElementName } ${ parseOptions.parseElementName } elements.`)
  const rootElementMap = parseData.elements.get(parseOptions.rootElementName) || new Map()
  const rootElements = [ ...rootElementMap.values() ]

  let elementList: any[]
  if(options.parseElementName && options.parseElementName !== options.rootElementName) {
    const rootElemment = reduceElements(rootElements, parseData)
    elementList = rootElemment[options.parseElementName]
  }
  else {
    elementList = rootElements.map(elements => reduceElements(elements, parseData))
      .filter(element => {
        const attributes = getElementAttributes(element)
        return attributes.default != '1' && !!attributes.id
      })
  }
  const processedElements: any[] = []

  const elementCount = elementList.length

  elementList.forEach((element, index) => {
    const attributes = getElementAttributes(element)

    LOGGER.info(`Building JSON for ${ attributes.id || attributes.value } ${ index + 1 }/${ elementCount }`)
    LOGGER.group('info')

    LOGGER.info(`Parsing ${ attributes.id }`)
    element = parseElement(element, null, parseOptions.rootElementName, parseData)

    LOGGER.info(`Formatting ${ attributes.id }`)
    processedElements.push(formatElement(element, null, parseData))
    LOGGER.groupEnd('info')
  })

  saveJSON(processedElements, parseData.buildNumber, parseData.options)

  LOGGER.info("Parsing Complete!")

  return processedElements
}
