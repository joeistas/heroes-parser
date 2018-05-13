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
  "AbilityModificationArray": functionTemplates.removeFromOutput,
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
  "Behavior": functionTemplates.removeFromOutput,
  "BehaviorArray": functionTemplates.removeFromOutput,
  "BehaviorCategories": functionTemplates.removeFromOutput,
  "BehaviorFlags": functionTemplates.removeFromOutput,
  "BehaviorLink": functionTemplates.removeFromOutput,
  "BehaviorLinkDisableArray": functionTemplates.removeFromOutput,
  "BehaviorState": functionTemplates.removeFromOutput,
  "CButton": functionTemplates.valueFromAttributeIfOnlyKey('icon'),
  "CombineArray": functionTemplates.removeFromOutput,
  "CritValidator": functionTemplates.removeFromOutput,
  "DamageDealtXP": functionTemplates.removeFromOutput,
  "DamageResponse": functionTemplates.removeFromOutput,
  "DamageTakenXP": functionTemplates.removeFromOutput,
  "DisableValidatorArray": functionTemplates.removeFromOutput,
  "Effect": functionTemplates.removeFromOutput,
  "EffectArray": functionTemplates.removeFromOutput,
  "ExcludeCasterPlayer": functionTemplates.removeFromOutput,
  "ExcludeCasterUnit": functionTemplates.removeFromOutput,
  "ExcludeOriginPlayer": functionTemplates.removeFromOutput,
  "Exhausted": functionTemplates.removeFromOutput,
  "ExpireEffect": functionTemplates.removeFromOutput,
  "LevelScalingArray": functionTemplates.removeFromOutput,
  "LoadTransportBehavior": functionTemplates.removeFromOutput,
  "MinimapRadius": functionTemplates.removeFromOutput,
  "MinStackCountDisplayed": functionTemplates.removeFromOutput,
  "NodeArray": functionTemplates.removeFromOutput,
  "OccludeHeight": functionTemplates.removeFromOutput,
  "OperandArray": functionTemplates.removeFromOutput,
  "OtherBehavior": functionTemplates.removeFromOutput,
  "OverlapIndex": functionTemplates.removeFromOutput,
  "PartyFrameImage": functionTemplates.removeFromOutput,
  "PartyPanelButtonImage": functionTemplates.removeFromOutput,
  "RemoveValidatorArray": functionTemplates.removeFromOutput,
  "Requirements": functionTemplates.removeFromOutput,
  "RowScoreValueOverride": functionTemplates.removeFromOutput,
  "SkinArray": functionTemplates.removeFromOutput,
  "SmartValidatorArray": functionTemplates.removeFromOutput,
  "TrackingBehavior": functionTemplates.removeFromOutput,
  "Validator": functionTemplates.removeFromOutput,
  "ValidatorArray": functionTemplates.removeFromOutput,
  "VOArray": functionTemplates.removeFromOutput,
}
