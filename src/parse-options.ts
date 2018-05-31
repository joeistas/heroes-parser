import { Logger } from './logger'
import { ElementFunctions } from './element'
import { DETAILED_FUNCTIONS } from './element-functions/detailed'

export interface ParseOptions {
  /** path to CASC directory or xml files */
  sourceDir: string
  /** true if [[ParseOptions.sourceDir]] is a CASC directory */
  sourceCASCStorage: boolean
  /** patterns of xml files to load from CASC directory. */
  xmlSearchPatterns: string[]
  /** patterns of text files to load from CASC directory. */
  textSearchPatterns: string[]
  /** patterns of asset files to load from CASC directory. */
  assetSearchPatterns: string[]
  /** element name of element to start parsing */
  rootElementName: string
  /**
    element id of element to start parsing. Only used if elements to parse are inner elements of root element
   */
  rootElementId: string
  /**
    inner elmement name of elements to parse. Only used if elements to parse are inner elements of root element
   */
  parseElementName?: string
  /**
    Functions used to define how to parse elements.

    Default profiles:
      [[BASIC_FUNCTIONS]]
      [[SKIN_FUNCTIONS]]
      [[VO_FUNCTIONS]]
      [[DETAILED_FUNCTIONS]]
      [[BASE_FUNCTIONS]]
   */
  elementFunctions: { [elementName: string]: ElementFunctions }
  /** set log level */
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

/**
  Build parse options. Merges `options` with [[DEFAULT_PARSE_OPTIONS]]
 */
export function buildParseOptions<Options extends ParseOptions>(options: Partial<Options>): ParseOptions {
  return Object.assign({}, DEFAULT_PARSE_OPTIONS, options)
}
