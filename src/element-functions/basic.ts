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
  "Behavior": functionTemplates.removeFromOutput,
  "BehaviorArray": functionTemplates.removeFromOutput,
  "CancelEffect": functionTemplates.removeFromOutput,
  "CaseDefault": functionTemplates.removeFromOutput,
  "CastOutroTimeEffect": functionTemplates.removeFromOutput,
  "CombineArray": functionTemplates.removeFromOutput,
  "CountEffect": functionTemplates.removeFromOutput,
  "CritValidatorArray": functionTemplates.removeFromOutput,
  "DeathUnloadEffect": functionTemplates.removeFromOutput,
  "DisplayEffect": functionTemplates.removeFromOutput,
  "Effect": functionTemplates.removeFromOutput,
  "EffectArray": functionTemplates.removeFromOutput,
  "EffectRange": functionTemplates.removeFromOutput,
  "Exhausted": functionTemplates.removeFromOutput,
  "ExpireEffect": functionTemplates.removeFromOutput,
  "FinalEffect": functionTemplates.removeFromOutput,
  "FollowRange": functionTemplates.removeFromOutput,
  "Handled": functionTemplates.removeFromOutput,
  "HitsChangedEffect": functionTemplates.removeFromOutput,
  "InitialEffect": functionTemplates.removeFromOutput,
  "ImpactEffect": functionTemplates.removeFromOutput,
  "LaunchEffect": functionTemplates.removeFromOutput,
  "LaunchMissileEffect": functionTemplates.removeFromOutput,
  "LevelScalingArray": functionTemplates.removeFromOutput,
  "LoadCargoEffect": functionTemplates.removeFromOutput,
  "PeriodicEffect": functionTemplates.removeFromOutput,
  "PeriodicEffectArray": functionTemplates.removeFromOutput,
  "PrepEffect": functionTemplates.removeFromOutput,
  "RefreshEffect": functionTemplates.removeFromOutput,
  "SkinArray": functionTemplates.removeFromOutput,
  "SpawnEffect": functionTemplates.removeFromOutput,
  "SmartValidatorArray": functionTemplates.removeFromOutput,
  "TeleportEffect": functionTemplates.removeFromOutput,
  "Tooltip": functionTemplates.renderTooltip(),
  "TooltipAddendum": functionTemplates.renderTooltip(),
  "TooltipAppender": functionTemplates.valueFromAttributeIfOnlyHasKeys("button"),
  "UnloadCargoEffect": functionTemplates.removeFromOutput,
  "Validator": functionTemplates.removeFromOutput,
  "ValidatorArray": functionTemplates.removeFromOutput,
  "VariationArray": functionTemplates.removeFromOutput,
  "VOArray": functionTemplates.removeFromOutput,
  "VoiceLineArray": functionTemplates.removeFromOutput,
  "Weapon": functionTemplates.removeFromOutput,
  "WeaponArray": functionTemplates.removeFromOutput,
  "WhichEffect": functionTemplates.removeFromOutput,
}
