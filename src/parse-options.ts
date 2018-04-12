import { Console } from 'console'
import { ElementFunctions } from './element'
import { DETAILED_FUNCTIONS } from './element-functions/detailed'

export interface ParseOptions {
  xmlSearchPatterns: string[]
  textSearchPatterns: string[]
  assetSearchPatterns: string[]
  rootElementName: string
  elementFunctions: { [elementName: string]: ElementFunctions }
  saveSourceFiles: boolean
  saveJSON: boolean
  archiveSourceFiles: boolean
  archiveJSON: boolean
  outputPath: string | null
  logLevel: 'none' | 'info' | 'debug'
  console: Console
}

export const DEFAULT_PARSE_OPTIONS: ParseOptions = {
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
  rootElementName: 'CHero',
  elementFunctions: DETAILED_FUNCTIONS,
  archiveSourceFiles: true,
  saveSourceFiles: false,
  archiveJSON: true,
  saveJSON: false,
  outputPath: null,
  logLevel: 'info',
  console: console
}

export function buildParseOptions(options: Partial<ParseOptions>): ParseOptions {
  return Object.assign({}, DEFAULT_PARSE_OPTIONS, options)
}
