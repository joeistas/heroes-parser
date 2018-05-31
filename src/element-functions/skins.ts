import { ElementFunctions } from '../element'

import * as elementFormatters from '../formatters/element-formatters'
import * as functionTemplates from '../element-functions/function-templates'

import { BASE_FUNCTIONS } from './base'

/** @hidden */
export const SKIN_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  "default": {
    ...BASE_FUNCTIONS.default,
    formatElement: elementFormatters.removeFromOutput
  },
  "CHero": BASE_FUNCTIONS.default,
  "CMount": BASE_FUNCTIONS.default,
  "CSkin": BASE_FUNCTIONS.default,
}

const names = [
  "AdditionalSearchText",
  "Day",
  "EventName",
  "FeatureArray",
  "HeroArray",
  "InfoText",
  "Month",
  "MountArray",
  "Name",
  "Rarity",
  "ReleaseDate",
  "SkinArray",
  "SortName",
  "UniverseIcon",
  "VariationArray",
  "VariationIcon",
  "Year",
]

names.forEach(name => {
  SKIN_FUNCTIONS[name] = {
    formatElement: elementFormatters.defaultElementFormatter,
    ...BASE_FUNCTIONS[name]
  }
})
