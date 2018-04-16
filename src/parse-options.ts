import { Console } from 'console'
import { ElementFunctions } from './element'
import { DETAILED_FUNCTIONS } from './element-functions/detailed'

export interface ParseOptions {
  sourceDir: string
  sourceCASCStorage: boolean
  buildNumber?: number,
  xmlSearchPatterns: string[]
  textSearchPatterns: string[]
  assetSearchPatterns: string[]
  rootElementName: string
  rootElementId: string
  parseElementName?: string
  elementFunctions: { [elementName: string]: ElementFunctions }
  saveSourceFiles: boolean
  saveJSON: boolean
  archiveSourceFiles: boolean
  archiveJSON: boolean
  outputPath?: string
  logLevel: 'none' | 'info' | 'debug'
  console: Console
}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {
  sourceDir: null,
  sourceCASCStorage: true,
  xmlSearchPatterns: [
    "mods/core.stormmod/base.stormdata/GameData/*Data.xml",
    "mods/heroesdata.stormmod/base.stormdata/GameData/*Data.xml",
    "mods/heromods/*.stormmod/base.stormdata/GameData/*.xml",
  ],
  textSearchPatterns: [
    "mods/core.stormmod/*.stormdata/LocalizedData/*.txt",
    "mods/heroesdata.stormmod/*/LocalizedData/*.txt",
    "mods/heromods/*/LocalizedData/*.txt",
  ],
  assetSearchPatterns: [
    "mods/core.stormmod/*.stormassets/*",
    "mods/heroes.stormmod/*.stormassets/*",
  ],
  rootElementName: 'CConfig',
  rootElementId: 'Config',
  parseElementName: 'HeroArray',
  elementFunctions: DETAILED_FUNCTIONS,
  archiveSourceFiles: true,
  saveSourceFiles: false,
  archiveJSON: true,
  saveJSON: false,
  logLevel: 'info',
  console: console
}

export function buildParseOptions(options: Partial<ParseOptions>): ParseOptions {
  return Object.assign({}, DEFAULT_PARSE_OPTIONS, options)
}
