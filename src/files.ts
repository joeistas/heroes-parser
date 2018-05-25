import * as path from 'path'
import { EOL } from 'os'
import { writeFile, readFile, createWriteStream } from 'fs'
import * as mkdirp from 'mkdirp'
import { parseString } from 'xml2js'
import * as JSZip from 'jszip'
import * as pluralize from 'pluralize'

import { getElementAttributes } from './element'
import { ParseOptions } from './parse-options'
import { getLogger } from './logger'

export const ASSET_FILENAME = 'asset-list.txt'

export function bufferToString(buffer: Buffer): string {
  return buffer.toString('utf8')
}

function formatFilePath(baseDir: string, filePath: string): string {
  return path.join(baseDir, ...filePath.split("\\"))
}

export function loadFile(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    readFile(filePath, (error, buffer) => {
      if(error) {
        reject(error)
      }

      resolve(buffer)
    })
  })
}

function saveFile(filePath: string, data: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const dirname = path.dirname(filePath)
    mkdirp(dirname, (error) => {
      writeFile(filePath, data, (error) => {
        if(error) {
          reject(error)
        }

        resolve()
      })
    })
  })
}

export function saveFilesToDisk(outputDir: string, fileData: [string, Buffer | string][]): Promise<void[]> {
  return Promise.all(
    fileData.map(([ filePath, data ]) => [ formatFilePath(outputDir, filePath), data])
    .map(([ filePath, data ]: [ string, Buffer ]) => saveFile(filePath, data))
  )
}

export function saveFilesToArchive(outputDir: string, archiveName: string, fileData: [string, Buffer | string][]) {
  const archive = new JSZip()

  fileData.forEach(([ filePath, data ]) => {
    archive.file(filePath.replace(/\\/g, "/"), data)
  })

  return new Promise((resolve, reject) => {
    archive.generateNodeStream()
      .pipe(createWriteStream(path.join(outputDir, archiveName)))
      .on('error', reject)
      .on('finish', resolve)
  })
}

function elementsToJSON(elements: any[]): [ string, string ][] {
  return elements.map(element => {
    return [
      (element.name || element.id) + ".json",
      JSON.stringify(element, null, 4)
    ] as [ string, string ]
  })
}

export async function saveJSON(elements: any[], outputPath: string) {
  const logger = getLogger()
  const json = elementsToJSON(elements)

  logger.info(`Saving json files in directory ${ path.resolve(outputPath) }`)
  await saveFilesToDisk(outputPath, json)
}

export async function saveJSONArchive(elements: any[], outputPath: string, archiveName: string) {
  const logger = getLogger()
  const json = elementsToJSON(elements)

  logger.info(`Saving json to archive ${ archiveName } at ${ path.resolve(outputPath) }`)
  await saveFilesToArchive(outputPath, archiveName, json)
}

export async function saveSourceFiles(fileData: [ string, string | Buffer ][], outputPath: string) {
  const logger = getLogger()
  logger.info(`Saving source files in directory ${ path.resolve(outputPath) }`)
  await saveFilesToDisk(outputPath, fileData)
}

export async function saveSourceArchive(fileData: [ string, string | Buffer ][], outputPath: string, archiveName: string) {
  const logger = getLogger()
  logger.info(`Saving source files to archive ${ archiveName } at ${ path.resolve(outputPath) }`)
  await saveFilesToArchive(outputPath, archiveName, fileData)
}

export function buildAssetListFileData(assetList: string[]): [ string, string ] {
  return [ ASSET_FILENAME, assetList.join(EOL) ]
}

export function xml2Json(fileXml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(fileXml, (error, json) => {
      if(error) {
        reject(error)
      }

      resolve(json)
    })
  })
}

export function formatElementName(options: ParseOptions) {
  let elementName = options.parseElementName || options.rootElementName
  elementName = elementName.startsWith('C') ? elementName.substring(1) : elementName
  elementName = elementName.replace('Array', '')
  return pluralize(elementName.split(/(?=[A-Z])/g).join('-').toLowerCase())
}
