import * as casclib from 'casclib'
import { parseString } from 'xml2js'

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
