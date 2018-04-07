import * as path from 'path'
import { writeFile, createWriteStream } from 'fs'
import * as mkdirp from 'mkdirp'
import * as casclib from 'casclib'
import { parseString } from 'xml2js'
import * as JSZip from 'jszip'

import { getElementAttributes } from './element'
import { ParseOptions } from './parse-options'

export async function readFiles(files: string[], storageHandle: any): Promise<[ string, Buffer ][]> {
  const fileData: [ string, Buffer ][] = []
  for(const filePath of files) {
    fileData.push([ filePath, await casclib.readFile(storageHandle, filePath) ])
  }

  return fileData
}

export function findFiles(searchPatterns: string[], storageHandle: any): Promise<string[]> {
  return Promise.all(searchPatterns.map(pattern => casclib.findFiles(storageHandle, pattern)))
    .then(results => results.reduce((combined, findResults) => combined.concat(findResults), []))
    .then(results => results.map(result => result.fullName))
}

function formatFilePath(baseDir: string, filePath: string): string {
  return path.join(baseDir, ...filePath.split("\\"))
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

export async function saveJSON(elements: any[], storageInfo: casclib.StorageInfo, options: ParseOptions) {
  if(!options.saveJSON) {
    return
  }

  let elementName = options.rootElementName.startsWith('C') ? options.rootElementName.substring(1) : options.rootElementName
  elementName = elementName.split(/(?=[A-Z])/g).join('-').toLowerCase()

  const json = elements.map(element => {
    return [
      path.join(elementName, element.id + ".json"),
      JSON.stringify(element, null, 4)
    ] as [ string, string ]
  })


  if(options.archiveJSON) {
    const archiveName = buildArchiveName(`HOTS-${ elementName }-data`, storageInfo)
    await saveFilesToArchive(outputPath(options), buildArchiveName('HOTS-hero-data', storageInfo), json)
  }
  else {
    await saveFilesToDisk(path.join(outputPath(options), storageInfo.gameBuild.toString()), json)
  }
}

export async function saveSourceFiles(fileData: [ string, Buffer ][], storageInfo: casclib.StorageInfo, options: ParseOptions) {
  if(!options.saveSourceFiles) {
    return
  }

  if(options.archiveSourceFiles) {
    await saveFilesToArchive(outputPath(options), buildArchiveName('HOTS-source-data', storageInfo), fileData)
  }
  else {
    await saveFilesToDisk(path.join(outputPath(options), storageInfo.gameBuild.toString()), fileData)
  }
}

function outputPath(options: ParseOptions): string {
  return options.outputPath || process.cwd()
}

function buildArchiveName(name: string, storageInfo: casclib.StorageInfo) {
  return `${ name }-${ storageInfo.gameBuild }.zip`
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
