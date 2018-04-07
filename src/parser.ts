import { join } from 'path'
import * as casclib from 'casclib'

import { ELEMENT_ATTRIBUTE_KEY, ElementFunctionsMap, getElementAttributes, reduceElements } from './element'
import { ElementMap, buildElementMap } from './element-map'
import { TextMap, buildTextMap } from './text'
import { findFiles, readFiles, xml2Json, saveJSON, saveSourceFiles } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { DEFAULT_FUNCTIONS } from './default-functions'
import { AssetFindCache, parseElement } from './element-parsers'
import { formatElement } from './format'

export interface ParseData {
  storageInfo: casclib.StorageInfo
  functions: ElementFunctionsMap
  elements: ElementMap
  assetfindCache: AssetFindCache
  assets: string[]
  text: TextMap
  options: ParseOptions
}

export async function parse(installPath: string, options: Partial<ParseOptions> = {}, elementFunctions: ElementFunctionsMap = DEFAULT_FUNCTIONS): Promise<any[]> {
  const storageHandle = await casclib.openStorage(installPath)
  const parseOptions = buildParseOptions(options)
  const parseData = await buildParseData(parseOptions, elementFunctions, storageHandle)

  const rootElements = parseData.elements.get(parseOptions.rootElementName) || new Map()
  const processedElements = []
  for(const elements of rootElements.values()) {
    let element = reduceElements(elements, parseData)

    const attributes = getElementAttributes(element)
    if(attributes.default == '1' || !attributes.id) {
      continue
    }

    element = parseElement(element, null, parseOptions.rootElementName, parseData)
    processedElements.push(formatElement(element, null, parseData))
  }

  casclib.closeStorage(storageHandle)

  saveJSON(processedElements, parseData.storageInfo, parseData.options)

  return processedElements
}

async function buildParseData(options: ParseOptions, elementFunctions: ElementFunctionsMap, storageHandle: any): Promise<ParseData> {
  const storageInfo = casclib.getStorageInfo(storageHandle)

  const [ sourceXML, sourceText ] = await fetchSourceFiles(options, storageHandle)
  saveSourceFiles(sourceXML.concat(sourceText), storageInfo, options)

  const elementMap = await fetchElements(sourceXML)
  const textMap = fetchText(sourceText)
  const assets = await fetchAssetFilePaths(options, storageHandle)

  return {
    functions: elementFunctions,
    elements: elementMap,
    assetfindCache: new Map(),
    text: textMap,
    storageInfo,
    assets,
    options,
  }
}

async function fetchSourceFiles(options: ParseOptions, storageHandle: any) {
  const sourceXML = await findFiles(options.xmlSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))

  const sourceText = await findFiles(options.textSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))

  return [ sourceXML, sourceText ]
}

function fetchElements(fileData: [string, Buffer][]): Promise<ElementMap> {
  const fileText = fileData.map(([ fileName, buffer ]) => buffer.toString('utf8'))

  return Promise.all(fileText.map(xml2Json))
    .then(data => data.map((fileData: any) => fileData.Catalog))
    .then(catalogs => buildElementMap(catalogs))
}

function fetchText(fileData: [string, Buffer][]): TextMap {
  const fileText = fileData.map(([ fileName, buffer ]) => [ fileName, buffer.toString('utf8') ] as [ string, string ])
  return buildTextMap(fileText)
}

function fetchAssetFilePaths(options: ParseOptions, storageHandle: any): Promise<string[]> {
  return findFiles(options.assetSearchPatterns, storageHandle)
}
