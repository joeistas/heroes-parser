import * as casclib from 'casclib'
import * as path from 'path'
import * as glob from 'glob'
import { existsSync } from 'fs'

import { readFiles, findFiles } from './casc'
import { ELEMENT_ATTRIBUTE_KEY, ElementFunctionsMap, getElementAttributes } from './element'
import { ElementMap, buildElementMap } from './element-map'
import { TextMap, buildTextMap, LINE_REGEXP } from './text'
import {
  ASSET_FILENAME,
  loadFile,
  xml2Json,
  saveJSON,
  saveSourceFiles,
  bufferToString,
  buildAssetListFileData
} from './files'
import { ParseOptions, buildParseOptions } from './parse-options'
import { parseElement } from './parsers'
import { AssetFindCache } from './parsers/asset-parsers'
import { formatElement } from './formatters'
import { getLogger } from './logger'

const XML_FILE_GLOB = [ "**", "*.xml" ]
const TEXT_FILE_GLOB = [ "**", "*.txt" ]

export interface ParseData {
  buildNumber?: number
  functions: ElementFunctionsMap
  elements: ElementMap
  assetfindCache: AssetFindCache
  assets: string[]
  text: TextMap
  options: ParseOptions
}

interface SourceData {
  XML: [ string, Buffer ][]
  text: [ string, Buffer ][]
  assets: string[]
  buildNumber?: number
}

export async function buildParseData(options: ParseOptions): Promise<ParseData> {
  let sourceData: SourceData
  if(options.sourceCASCStorage) {
    sourceData = await loadFromCASC(options)

    await saveSourceFiles(
      [
        ...sourceData.XML,
        ...sourceData.text,
        buildAssetListFileData(sourceData.assets),
      ],
      sourceData.buildNumber,
      options
    )
  }
  else {
    sourceData = await loadFromDirectory(options)
  }

  const logger = getLogger()

  logger.info("Building element map...")
  const elementMap = await fetchElements(sourceData.XML)
  logger.info("Element map built.")
  logger.info("Building text map...")
  const textMap = fetchText(sourceData.text)
  logger.info("Text map built.")

  return {
    functions: options.elementFunctions,
    elements: elementMap,
    assetfindCache: new Map(),
    text: textMap,
    buildNumber: sourceData.buildNumber,
    assets: sourceData.assets,
    options,
  }
}

async function loadFromDirectory(options: ParseOptions): Promise<SourceData> {
  const logger = getLogger()
  logger.info(`Loading source files from directory ${ options.sourceDir }...`)
  return {
    XML: await loadFiles(options.sourceDir, XML_FILE_GLOB),
    text: await loadFiles(options.sourceDir, TEXT_FILE_GLOB),
    assets: await loadAssetListFromDir(options.sourceDir, ASSET_FILENAME)
  }
}

function loadFiles(dir: string, pattern: string[]): Promise<[ string, Buffer ][]> {
  return new Promise<string[]>((resolve, reject) => {
    const fileGlob = path.join(dir, ...pattern)
    glob(fileGlob, (error, fileNames) => {
      if(error) {
        reject(error)
      }

      resolve(fileNames)
    })
  })
  .then(fileNames => {
    return Promise.all(
      fileNames.map(
        filePath => loadFile(filePath)
          .then(buffer => [ filePath, buffer] as [ string, Buffer ])
      )
    )
  })
}

async function loadAssetListFromDir(sourceDir: string, assetFileName: string): Promise<string[]> {
  const assetFilePath = path.join(sourceDir, assetFileName)
  if(!existsSync(assetFilePath)) {
    return []
  }

  return loadFile(assetFilePath)
    .then(buffer => bufferToString(buffer))
    .then(fileData => fileData.split(LINE_REGEXP))
}

async function loadFromCASC(options: ParseOptions): Promise<SourceData> {
  const storageHandle = await casclib.openStorage(options.sourceDir)

  try {
    return {
      XML: await loadXMLFilesFromCASC(options, storageHandle),
      text: await loadTextFilesFromCASC(options, storageHandle),
      assets: await loadAssetFilePathsFromCASC(options, storageHandle),
      buildNumber: casclib.getStorageInfo(storageHandle).gameBuild,
    }
  }
  finally {
    casclib.closeStorage(storageHandle)
  }
}

async function loadXMLFilesFromCASC(options: ParseOptions, storageHandle: any) {
  const logger = getLogger()
  logger.info("Loading XML files from game storage...")
  const sourceXML = await findFiles(options.xmlSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))

  logger.info("XML files loaded")
  return sourceXML
}

async function loadTextFilesFromCASC(options: ParseOptions, storageHandle: any) {
  const logger = getLogger()
  logger.info("Loading text files from game storage...")
  const sourceText = await findFiles(options.textSearchPatterns, storageHandle)
    .then(filePaths => readFiles(filePaths, storageHandle))
  logger.info("Text files loaded")

  return sourceText
}

function loadAssetFilePathsFromCASC(options: ParseOptions, storageHandle: any): Promise<string[]> {
  const logger = getLogger()
  logger.info("Loading asset file list from game storage...")
  const assets = findFiles(options.assetSearchPatterns, storageHandle)
  logger.info("Asset file list loaded.")
  return assets
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
