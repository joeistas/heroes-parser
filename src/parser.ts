import { join } from 'path'
import * as casclib from 'casclib'

import { ELEMENT_ATTRIBUTE_KEY, ElementFunctionsMap, getElementAttributes, reduceElements } from './element'
import { ElementMap, buildElementMap } from './element-map'
import { TextMap, buildTextMap } from './text'
import { findFiles, readFiles, xml2Json, saveJSON, saveSourceFiles, bufferToString, buildAssetListFileData } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { parseElement } from './parsers'
import { AssetFindCache } from './parsers/asset-parsers'
import { formatElement } from './formatters'

export interface Logger {
  info: (...args: any[]) => void
  debug: (...args: any[]) => void
  error: (...args: any[]) => void
  group: (level?: 'info' | 'debug') => void
  groupEnd: (level?: 'info' | 'debug') => void
}

export interface ParseData {
  storageInfo: casclib.StorageInfo
  functions: ElementFunctionsMap
  elements: ElementMap
  assetfindCache: AssetFindCache
  assets: string[]
  text: TextMap
  options: ParseOptions
}

export let LOGGER: Logger

export async function parse(installPath: string, options: Partial<ParseOptions> = {}): Promise<any[]> {
  const storageHandle = await casclib.openStorage(installPath)

  const parseOptions = buildParseOptions(options)
  LOGGER = buildLogger(parseOptions)

  let parseData: ParseData
  try {
    parseData = await buildParseData(parseOptions, storageHandle)
  }
  catch(error) {
    LOGGER.error(error)
    return
  }
  finally {
    casclib.closeStorage(storageHandle)
  }

  LOGGER.info(`Building JSON for ${ parseOptions.rootElementName } elements.`)
  const rootElements = parseData.elements.get(parseOptions.rootElementName) || new Map()
  const processedElements: any[] = []

  const elementList = [ ...rootElements.values() ].map(elements => reduceElements(elements, parseData))
    .filter(element => {
      const attributes = getElementAttributes(element)
      return attributes.default != '1' && !!attributes.id
    })

  const elementCount = elementList.length

  elementList.forEach((element, index) => {
    const attributes = getElementAttributes(element)

    LOGGER.info(`Building JSON for ${ attributes.id } ${ index + 1 }/${ elementCount }`)
    LOGGER.group('info')

    LOGGER.info(`Parsing ${ attributes.id }`)
    element = parseElement(element, null, parseOptions.rootElementName, parseData)

    LOGGER.info(`Formatting ${ attributes.id }`)
    processedElements.push(formatElement(element, null, parseData))
    LOGGER.groupEnd('info')
  })

  saveJSON(processedElements, parseData.storageInfo, parseData.options)

  LOGGER.info("Parsing Complete!")

  return processedElements
}

async function buildParseData(options: ParseOptions, storageHandle: any): Promise<ParseData> {
  const storageInfo = casclib.getStorageInfo(storageHandle)

  const [ sourceXML, sourceText ] = await fetchSourceFiles(options, storageHandle)

  LOGGER.info("Loading asset file list...")
  const assets = await fetchAssetFilePaths(options, storageHandle)
  LOGGER.info("Asset file list loaded.")

  await saveSourceFiles(
    [
      ...sourceXML,
      ...sourceText,
      buildAssetListFileData(assets),
    ],
    storageInfo,
    options
  )

  LOGGER.info("Building element map...")
  const elementMap = await fetchElements(sourceXML)
  LOGGER.info("Element map built.")
  LOGGER.info("Building text map...")
  const textMap = fetchText(sourceText)
  LOGGER.info("Text map built.")

  return {
    functions: options.elementFunctions,
    elements: elementMap,
    assetfindCache: new Map(),
    text: textMap,
    storageInfo,
    assets,
    options,
  }
}

function buildLogger(options: ParseOptions): Logger {
  return {
    info: options.logLevel === 'none' ? () => null : options.console.info,
    debug: options.logLevel !== 'debug' ? () => null : options.console.debug,
    error: options.console.error,
    group: (level: string = 'debug'): void => {
      if(options.logLevel === 'none' || (options.logLevel === 'info' && level === 'debug')) {
        return
      }

      options.console.group()
    },
    groupEnd: (level: string = 'debug'): void => {
      if(options.logLevel === 'none' || (options.logLevel === 'info' && level === 'debug')) {
        return
      }

      options.console.groupEnd()
    },
  }
}

async function fetchSourceFiles(options: ParseOptions, storageHandle: any) {
  LOGGER.info("Loading XML files...")
  const sourceXML = await findFiles(options.xmlSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))

  LOGGER.info("XML files loaded")
  LOGGER.info("Loading text files...")
  const sourceText = await findFiles(options.textSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))
  LOGGER.info("Text files loaded")

  return [ sourceXML, sourceText ]
}

function fetchElements(fileData: [string, Buffer][]): Promise<ElementMap> {
  const fileText = fileData.map(([ fileName, buffer ]) => bufferToString(buffer))

  return Promise.all(fileText.map(xml2Json))
    .then(data => data.map((fileData: any) => fileData.Catalog))
    .then(catalogs => buildElementMap(catalogs))
}

function fetchText(fileData: [string, Buffer][]): TextMap {
  const fileText = fileData.map(([ fileName, buffer ]) => [ fileName, bufferToString(buffer) ] as [ string, string ])
  return buildTextMap(fileText)
}

function fetchAssetFilePaths(options: ParseOptions, storageHandle: any): Promise<string[]> {
  return findFiles(options.assetSearchPatterns, storageHandle)
}
