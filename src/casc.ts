import * as casclib from 'casclib'

/** @hidden */
export async function readFiles(files: string[], storageHandle: any, stripNull: boolean = true): Promise<[ string, Buffer ][]> {
  const fileData: [ string, Buffer ][] = []
  for(const filePath of files) {
    const data = await casclib.readFile(storageHandle, filePath)
    fileData.push([ filePath, stripNull ? removeNullValuesFromBuffer(data) : data ])
  }

  return fileData
}

/** @hidden */
export function findFiles(searchPatterns: string[], storageHandle: any): Promise<string[]> {
  return Promise.all(searchPatterns.map(pattern => casclib.findFiles(storageHandle, pattern)))
    .then(results => results.reduce((combined, findResults) => combined.concat(findResults), []))
    .then(results => results.map(result => result.fullName))
}

function removeNullValuesFromBuffer(buffer: Buffer): Buffer {
  return buffer.slice(0, buffer.indexOf(0))
}
