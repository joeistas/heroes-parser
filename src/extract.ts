import * as traverse from 'traverse'

import { readFiles } from './casc'
import { saveFilesToDisk } from './files'

const AUDIO_FILE_TYPES = [ 'wav', 'ogg' ]
const IMAGE_FILE_TYPES = [ 'dds' ]

/**
  Options used by [[extractAssets]]
 */
export interface ExtractOptions {
  /** directory where extracted assets will be saved. */
  outputDir: string
  /** file paths of assets to extract from game storage */
  filePaths: string[]
  /** type of assets to extract */
  type: 'all' | 'audio' | 'images'
  /** extract assets found in json data instead of [[ExtractOptions.filePaths]]*/
  jsonData?: any,
}

/**
  Extracts and saves assets from Heroes of the Storm game storage to disk.

  @param storageHandle casclib storage handle
 */
export function extractAssets(storageHandle: any, options: ExtractOptions): Promise<void[]> {
  let assets: string[]
  if(options.jsonData) {
    assets = assetsFromJson(options.jsonData)
  }
  else {
    assets = options.filePaths
  }

  if(options.type === 'audio') {
    assets = assets.filter(filePath => fileIsOfTypes(filePath, AUDIO_FILE_TYPES))
  }

  if(options.type === 'images') {
    assets = assets.filter(filePath => fileIsOfTypes(filePath, IMAGE_FILE_TYPES))
  }

  return readFiles(assets, storageHandle, false)
    .then(fileData => saveFilesToDisk(options.outputDir, fileData))
}

function assetsFromJson(json: any): string[] {
  return traverse(json).reduce((acc, value) => {
    if(isAsset(value)) {
      acc.push(value)
    }
    return acc
  }, [])
}

function isAsset(value: any) {
  return value && typeof value === 'string' && !!value.match(/^mods\/.*\..{3}$/)
}

function fileIsOfTypes(filePath: string, extensions: string[]): boolean {
  return extensions.includes(getFileExtension(filePath))
}

function getFileExtension(filePath: string): string {
  const match = filePath.match(/\.(.{3})$/)
  return match[1]
}
