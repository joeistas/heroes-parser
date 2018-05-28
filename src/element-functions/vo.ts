import { ElementFunctions } from '../element'

import * as elementFormatters from '../formatters/element-formatters'
import * as functionTemplates from '../element-functions/function-templates'

import { BASE_FUNCTIONS } from './base'

export const VO_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  "default": {
    ...BASE_FUNCTIONS.default,
    formatElement: elementFormatters.removeFromOutput
  },
  "CHero": BASE_FUNCTIONS.default,
  "CMount": BASE_FUNCTIONS.default,
}

const names = [
  "Name",
  "HeroArray",
  "MountArray",
  "VOArray",
  "VODefinition",
  "VoiceLineArray",
]

names.forEach(name => {
  VO_FUNCTIONS[name] = {
    formatElement: elementFormatters.defaultElementFormatter,
    ...BASE_FUNCTIONS[name]
  }
})
