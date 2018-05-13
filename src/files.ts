import * as path from 'path'
import { EOL } from 'os'
import { writeFile, readFile, createWriteStream } from 'fs'
import * as mkdirp from 'mkdirp'
import { parseString } from 'xml2js'
import * as JSZip from 'jszip'

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

export async function saveJSON(elements: any[], buildNumber: number, options: ParseOptions) {
  if(!options.saveJSON) {
    return
  }

  const logger = getLogger()
  const elementName = formatElementName(options)

  const json = elements.map(element => {
    return [
      path.join(elementName, element.id + ".json"),
      JSON.stringify(element, null, 4)
    ] as [ string, string ]
  })

  if(options.archiveJSON) {
    const archiveName = buildArchiveName(`HOTS-${ elementName }-data`, buildNumber)
    const outputDir = outputPath(options)
    logger.info(`Saving json to archive ${ archiveName } at ${ outputDir }`)
    await saveFilesToArchive(outputDir, archiveName, json)
  }
  else {
    const outputDir = buildNumber ? path.join(outputPath(options), buildNumber.toString()) : outputPath(options)
    logger.info(`Saving json files in directory ${ outputDir }`)
    await saveFilesToDisk(outputDir, json)
  }
}

export async function saveSourceFiles(fileData: [ string, string | Buffer ][], buildNumber: number, options: ParseOptions) {
  if(!options.saveSourceFiles) {
    return
  }

  const logger = getLogger()

  if(options.archiveSourceFiles) {
    const archiveName = buildArchiveName('HOTS-source-data', buildNumber)
    const outputDir = outputPath(options)
    logger.info(`Saving source files to archive ${ archiveName } at ${ outputDir }`)
    await saveFilesToArchive(outputDir, archiveName, fileData)
  }
  else {
    const outputDir = buildNumber ? path.join(outputPath(options), buildNumber.toString()) : outputPath(options)
    logger.info(`Saving source files in directory ${ outputDir }`)
    await saveFilesToDisk(outputDir, fileData)
  }
}

export function buildAssetListFileData(assetList: string[]): [ string, string ] {
  return [ ASSET_FILENAME, assetList.join(EOL) ]
}

function outputPath(options: ParseOptions): string {
  return options.outputPath || process.cwd()
}

function buildArchiveName(name: string, buildNumber: number) {
  return buildNumber ? `${ name }-${ buildNumber }.zip` : `${ name }.zip`
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

function formatElementName(options: ParseOptions) {
  let elementName = options.parseElementName || options.rootElementName
  elementName = elementName.startsWith('C') ? elementName.substring(1) : elementName
  elementName = elementName.replace('Array', '')
  return elementName.split(/(?=[A-Z])/g).join('-').toLowerCase()
}
