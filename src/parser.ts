import { getElementAttributes, joinElements, mergeWithParent, getElement } from './element'
import { saveJSON } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { parseElement } from './parsers'
import { formatElement } from './formatters'
import { buildLogger } from './logger'
import { ParseData, buildParseData } from './parse-data'

export async function parse(options: Partial<ParseOptions> = {}): Promise<any[]> {
  const parseOptions = buildParseOptions(options)

  const logger = buildLogger(parseOptions.logger, options.logLevel)
  let parseData: ParseData
  try {
    parseData = await buildParseData(parseOptions)
  }
  catch(error) {
    logger.error(error)
    return null
  }

  logger.info(`Building JSON for ${ parseOptions.rootElementName } ${ parseOptions.parseElementName } elements.`)
  let elementList: any[]
  if(parseOptions.parseElementName && parseOptions.parseElementName !== parseOptions.rootElementName) {
    const rootElement = mergeWithParent(
      joinElements(getElement(parseOptions.rootElementId, parseOptions.rootElementName, parseData.elements)),
      parseOptions.rootElementName,
      parseData
    )

    elementList = rootElement[parseOptions.parseElementName]
  }
  else {
    const rootElements = parseData.elements.get(parseOptions.rootElementName) || new Map()
    elementList = [ ...rootElements.values() ].map(elements => joinElements(elements))
      .filter(element => {
        const attributes = getElementAttributes(element)
        return attributes.default != '1' && !!attributes.id
      })
  }
  const processedElements: any[] = []

  const elementCount = elementList.length

  elementList.forEach((element, index) => {
    const attributes = getElementAttributes(element)
    const name = attributes.id || attributes.value
    const elementName = parseOptions.parseElementName || parseOptions.rootElementName
    logger.info(`Building JSON for ${ name } ${ index + 1 }/${ elementCount }`)
    logger.group('info')

    logger.info(`Parsing ${ name }`)
    element = parseElement(element, null, elementName, parseData)

    logger.info(`Formatting ${ name }`)
    processedElements.push(formatElement(element, null, parseData))
    logger.groupEnd('info')
  })

  saveJSON(processedElements, parseData.buildNumber, parseData.options)

  logger.info("Parsing Complete!")

  return processedElements
}
