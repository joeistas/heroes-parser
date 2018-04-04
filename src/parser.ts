import * as casclib from 'casclib'
import * as util from 'util'

import { ELEMENT_ATTRIBUTE_KEY, ElementFunctionsMap, parseElement, getElementAttributes, reduceElements } from './element'
import { ElementMap, buildElementMap } from './element-map'
import { TextMap, buildTextMap } from './text'
import { findFiles, readFiles, xml2Json } from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { DEFAULT_FUNCTIONS } from './default-functions'
import { AssetFindCache } from './processors/asset'

export interface ParseData {
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
    const element = reduceElements(elements, parseData)

    const attributes = getElementAttributes(element)
    if(attributes.default == '1') {
      continue
    }

    processedElements.push(await parseElement(element, null, parseOptions.rootElementName, parseData))
  }

  casclib.closeStorage(storageHandle)

  return processedElements
}

async function buildParseData(options: ParseOptions, elementFunctions: ElementFunctionsMap, storageHandle: any): Promise<ParseData> {
  const elementMap = await fetchElements(options, storageHandle)
  const textMap = await fetchText(options, storageHandle)
  const assets = await fetchAssetFilePaths(options, storageHandle)

  return {
    functions: elementFunctions,
    elements: elementMap,
    assetfindCache: new Map(),
    text: textMap,
    assets,
    options,
  }
}

function fetchElements(options: ParseOptions, storageHandle: any): Promise<ElementMap> {
  return findFiles(options.xmlSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))
    .then(buffers => buffers.map(([ fileName, buffer ]) => buffer.toString('utf8')))
    .then(fileStrings => Promise.all(fileStrings.map(xml2Json)))
    .then(data => data.map((fileData: any) => fileData.Catalog))
    .then(catalogs => buildElementMap(catalogs))
}

function fetchText(options: ParseOptions, storageHandle: any): Promise<TextMap> {
  return findFiles(options.xmlSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))
    .then(buffers => buffers.map(([ fileName, buffer ]) => [ fileName, buffer.toString('utf8') ] as [ string, string ]))
    .then(fileData => buildTextMap(fileData))
}

function fetchAssetFilePaths(options: ParseOptions, storageHandle: any): Promise<string[]> {
  return findFiles(options.assetSearchPatterns, storageHandle)
}
