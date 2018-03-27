import * as casclib from 'casclib'

import { ElementFunctionsMap, parseElement } from './element'
import { ElementMap, buildElementMap } from './element-map'
import { TextMap, buildTextMap } from './text'
import { findFiles, readFiles, xml2Json } from './files'

export interface ParseData {
  functions: ElementFunctionsMap
  elements: ElementMap
  text: TextMap
  options: ParseOptions
}

export interface ParseOptions {
  xmlSearchPatterns: string[]
  textSearchPatterns: string[]
  locales: string[]
  functions: ElementFunctionsMap
}

export function parse(installPath: string, options: ParseOptions): Promise<any> {
  return casclib.openStorage(installPath)
    .then(storageHandle => {
      return buildParseData(options, storageHandle)
        .then(async parseData => {
          const heroElements = parseData.elements.get('CHero') || new Map()
          const processedHeroes = []
          for(const heroes of heroElements.values()) {
            for(const hero of heroes) {
              if(hero.$ && hero.$.default === '1') {
                continue
              }
              processedHeroes.push(await parseElement(hero, null, 'CHero', storageHandle, parseData))
            }
          }

          console.log(processedHeroes.find(h => h.$.id === 'Abathur').TalentTreeArray)
          console.log(processedHeroes.length)
          casclib.closeStorage(storageHandle)
        })
    })
    .catch(error => console.log(error))
}

async function buildParseData(options: ParseOptions, storageHandle: any): Promise<ParseData> {
  const elementMap = await fetchElements(options, storageHandle)
  const textMap = await fetchText(options, storageHandle)

  return {
    functions: options.functions,
    elements: elementMap,
    text: textMap,
    options: options
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
