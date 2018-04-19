import { getElementAttributes, joinElements, mergeWithParent } from './element'
import { saveJSON } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { parseElement } from './parsers'
import { formatElement } from './formatters'
import { LOGGER, buildLogger } from './logger'
import { ParseData, buildParseData } from './parse-data'

export async function parse(options: Partial<ParseOptions> = {}): Promise<any[]> {
  const parseOptions = buildParseOptions(options)

  buildLogger(parseOptions)
  let parseData: ParseData
  try {
    parseData = await buildParseData(parseOptions)
  }
  catch(error) {
    LOGGER.error(error)
    return null
  }

  LOGGER.info(`Building JSON for ${ parseOptions.rootElementName } ${ parseOptions.parseElementName } elements.`)
  const rootElements = parseData.elements.get(parseOptions.rootElementName) || new Map()
  let elementList: any[]
  if(parseOptions.parseElementName && parseOptions.parseElementName !== parseOptions.rootElementName) {
    const rootElement = mergeWithParent(
      joinElements(rootElements.get(parseOptions.rootElementId)),
      parseOptions.rootElementName,
      parseData
    )

    elementList = rootElement[parseOptions.parseElementName]
  }
  else {
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
    LOGGER.info(`Building JSON for ${ name } ${ index + 1 }/${ elementCount }`)
    LOGGER.group('info')

    LOGGER.info(`Parsing ${ name }`)
    element = parseElement(element, null, elementName, parseData)

    LOGGER.info(`Formatting ${ name }`)
    processedElements.push(formatElement(element, null, parseData))
    LOGGER.groupEnd('info')
  })

  saveJSON(processedElements, parseData.buildNumber, parseData.options)

  LOGGER.info("Parsing Complete!")

  return processedElements
}
