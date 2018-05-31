import * as element from './element'
import * as merge from './merge'
import * as tooltipBase from './tooltip'

import * as baseParsers from "./parsers"
import * as addParsers from "./parsers/add-parsers"
import * as assetParsers from "./parsers/asset-parsers"
import * as mergeParsers from "./parsers/merge-parsers"
import * as textParsers from "./parsers/text-parsers"
import * as conditionalParsers from './parsers/conditional-parsers'
import * as elementNameFilters from "./parsers/element-name-filters"
import * as arrayFormatters from "./formatters/array-formatters"
import * as elementFormatters from "./formatters/element-formatters"
import * as keyFormatters from "./formatters/key-formatters"
import * as functionTemplates from './element-functions/function-templates'

export { initialElements, parseElements } from './parser'
export { BASE_FUNCTIONS } from './element-functions/base'
export { DETAILED_FUNCTIONS } from './element-functions/detailed'
export { BASIC_FUNCTIONS } from './element-functions/basic'
export { SKIN_FUNCTIONS } from './element-functions/skins'
export { VO_FUNCTIONS } from './element-functions/vo'
export { ExtractOptions, extractAssets } from './extract'
export { getLogger, buildLogger } from './logger'
export { ParseData, SourceData, buildParseData, loadSourceData } from './parse-data'
export { ParseOptions, DEFAULT_PARSE_OPTIONS, buildParseOptions } from './parse-options'
export { ElementTypeMap, ElementMap } from './element-map'
export { LocaleTextMap, TextMap } from './text'
export {
  element,
  merge,
  functionTemplates,
}

export namespace tooltips {
  export type TooltipReference = tooltipBase.TooltipReference
  export type TooltipVariable = tooltipBase.TooltipVariable
  export type TooltipData = tooltipBase.TooltipData
  export type TooltipFormulaReplaceFunction = tooltipBase.TooltipFormulaReplaceFunction
  export type TooltipElementReplaceFunction = tooltipBase.TooltipElementReplaceFunction
  export type TooltipRenderFunction = tooltipBase.TooltipRenderFunction

  export const parseTooltipText = tooltipBase.parseTooltipLocaleText
  export const renderTooltipData = tooltipBase.renderTooltipData
  export const handleBarsTemplateReplacement = tooltipBase.handleBarsTemplateReplacement
  export const toSpanElement = tooltipBase.toSpanElement
  export const renderTooltipWithHandlebars = tooltipBase.renderTooltipWithHandlebars
}

export namespace parsers {
  export type ElementParser = baseParsers.ElementParser
  export type ParseContext = baseParsers.ParseContext
  
  export const join = baseParsers.join
  export const defaultPreParser = baseParsers.defaultPreParser

  export const add = addParsers
  export const assets = assetParsers
  export const merge = mergeParsers
  export const text = textParsers
  export const conditional = conditionalParsers
  export const nameFilters = elementNameFilters
}

export namespace formatters {
  export const array = arrayFormatters
  export const element = elementFormatters
  export const key = keyFormatters
}
