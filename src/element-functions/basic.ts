import { ELEMENT_ATTRIBUTE_KEY, ElementFunctions, getElementAttributes } from '../element'
import { ParseData } from '../parse-data'
import * as parsers from '../parsers'
import * as addParsers from '../parsers/add-parsers'
import * as assetParsers from '../parsers/asset-parsers'
import * as mergeParsers from '../parsers/merge-parsers'
import * as textParsers from '../parsers/text-parsers'
import * as elementNameFilters from '../parsers/element-name-filters'
import * as arrayFormatters from '../formatters/array-formatters'
import * as elementFormatters from '../formatters/element-formatters'
import * as keyFormatters from '../formatters/key-formatters'
import { defaultMerge, singleElement } from '../merge'
import * as functionTemplates from './function-templates'

import { DETAILED_FUNCTIONS } from './detailed'

export const BASIC_FUNCTIONS = {
  ...DETAILED_FUNCTIONS,
  "AcquirePlayer": functionTemplates.removeFromOutput,
  "AddedThreat": functionTemplates.removeFromOutput,
  "AIBaseThreat": functionTemplates.removeFromOutput,
  "AIEvalFactor": functionTemplates.removeFromOutput,
  "AIHealthThresholds": functionTemplates.removeFromOutput,
  "AIThinkTree": functionTemplates.removeFromOutput,
  "AIUtility": functionTemplates.removeFromOutput,
  "Alignment": functionTemplates.removeFromOutput,
  "AlliedPushPriority": functionTemplates.removeFromOutput,
  "AttackTargetPriority": functionTemplates.removeFromOutput,
  "CButton": functionTemplates.valueFromAttributeIfOnlyKey('icon'),
  "DamageDealtXP": functionTemplates.removeFromOutput,
  "DamageResponse": functionTemplates.removeFromOutput,
  "DamageTakenXP": functionTemplates.removeFromOutput,
  "RowScoreValueOverride": functionTemplates.removeFromOutput,
  "ExcludeCasterPlayer": functionTemplates.removeFromOutput,
  "ExcludeCasterUnit": functionTemplates.removeFromOutput,
  "ExcludeOriginPlayer": functionTemplates.removeFromOutput,
  "MinimapRadius": functionTemplates.removeFromOutput,
  "MinStackCountDisplayed": functionTemplates.removeFromOutput,
  "OccludeHeight": functionTemplates.removeFromOutput,
  "OverlapIndex": functionTemplates.removeFromOutput,
  "PartyFrameImage": functionTemplates.removeFromOutput,
  "PartyPanelButtonImage": functionTemplates.removeFromOutput,
  "VOArray": functionTemplates.removeFromOutput,
}
