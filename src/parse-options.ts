import { Logger } from './logger'
import { ElementFunctions } from './element'
import { DETAILED_FUNCTIONS } from './element-functions/detailed'

export interface ParseOptions {
  sourceDir: string
  sourceCASCStorage: boolean
  xmlSearchPatterns: string[]
  textSearchPatterns: string[]
  assetSearchPatterns: string[]
  rootElementName: string
  rootElementId: string
  parseElementName?: string
  elementFunctions: { [elementName: string]: ElementFunctions }
  logLevel: 'none' | 'info' | 'debug'
  logger: Logger
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
  logLevel: 'info',
  logger: console
}

export function buildParseOptions<Options extends ParseOptions>(options: Partial<Options>): ParseOptions {
  return Object.assign({}, DEFAULT_PARSE_OPTIONS, options)
}
