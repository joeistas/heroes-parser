import { ElementFunctions, getElement } from "../element"
import { ParseData } from "../parse-data"
import * as parsers from "../parsers"
import * as addParsers from "../parsers/add-parsers"
import * as assetParsers from "../parsers/asset-parsers"
import * as elementParsers from "../parsers/element-parsers"
import * as mergeParsers from "../parsers/merge-parsers"
import * as textParsers from "../parsers/text-parsers"
import * as conditionalParsers from '../parsers/conditional-parsers'
import * as elementNameFilters from "../parsers/element-name-filters"
import * as arrayFormatters from "../formatters/array-formatters"
import * as elementFormatters from "../formatters/element-formatters"
import * as keyFormatters from "../formatters/key-formatters"
import { defaultMerge, singleElement } from "../merge"
import * as functionTemplates from "./function-templates"

const ABIL_TYPE_FILTER = elementNameFilters.startsWith("CAbil")
const EFFECT_TYPE_FILTER = elementNameFilters.startsWith("CEffect")
const BEHAVIOR_TYPE_FILTER = elementNameFilters.startsWith("CBehavior")
const VALIDATOR_TYPE_FILTER = elementNameFilters.startsWith("CValidator")
const KINETIC_TYPE_FILTER = elementNameFilters.startsWith("CKinetic")
const REQUIREMENT_TYPE_FILTER = elementNameFilters.startsWith("CRequirement")
const WEAPON_TYPE_FILTER = elementNameFilters.startsWith("CWeapon")
const ITEM_TYPE_FILTER = elementNameFilters.startsWith("CItem")
const ACCUMULATOR_TYPE_FILTER = elementNameFilters.startsWith("CAccumulator")

const singleEffect = {
  ...functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
  merge: singleElement,
  formatElement: elementFormatters.conditionallyFormatElement(
    elementFormatters.onlyHasKeys('value'),
    elementFormatters.removeFromOutput,
  )
}

const returnEffectOrRemove = {
  formatElement: elementFormatters.join(
    elementFormatters.removeAttributeFromElement('value'),
    elementFormatters.conditionallyFormatElement(
      elementFormatters.onlyHasKeys('effect'),
      elementFormatters.valueFromAttribute('effect'),
      elementFormatters.removeFromOutput
    )
  ),
}

export const BASE_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  "default": {
    merge: defaultMerge,
    preParse: parsers.defaultPreParser,
    formatKey: keyFormatters.defaultKeyFormatter,
    formatElement: elementFormatters.defaultElementFormatter,
    formatArray: arrayFormatters.defaultArrayFormatter,
  },
  "Abil": {
    merge: singleElement,
    preParse: parsers.join(
      parsers.defaultPreParser,
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName(
          elementNameFilters.inList(
            'HeroAbilArray',
            'CItemAbil',
            'CUnit'
          )
        ),
        functionTemplates.mergeElement(ABIL_TYPE_FILTER).preParse
      ),
    ),
    formatKey: "ability"
  },
  "AbilArray": {
    ...functionTemplates.valueFromAttributeIfOnlyHasKeys("link"),
    formatKey: "abilities",
  },
  "AbilClass": {
    ...functionTemplates.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.removeFromStartOfAttribute("CAbil", "value"),
      elementFormatters.defaultElementFormatter
    ),
    formatKey: 'abilityType',
  },
  "AbilClassEnableArray": {
    ...functionTemplates.flags(),
    formatElement: elementFormatters.join(
      elementFormatters.removeFromStartOfAttribute("CAbil", "index"),
      functionTemplates.flags().formatElement
    ),
    formatKey: "enableAbilityTypes"
  },
  "AbilClassDisableArray": {
    ...functionTemplates.flags(),
    formatElement: elementFormatters.join(
      elementFormatters.removeFromStartOfAttribute("CAbil", "index"),
      functionTemplates.flags().formatElement
    ),
    formatKey: "disableAbilityTypes"
  },
  "AbilityCategories": {
    ...functionTemplates.flags(),
    formatKey: "categories"
  },
  "AbilityModificationArray": {
    ...functionTemplates.valueFromAttributeIfOnlyHasKeys('modifications'),
    formatKey: "modifications"
  },
  "AbilityStage": functionTemplates.singleElement,
  "AbilLinkDisableArray": {
    ...functionTemplates.arrayOfSingleValues(),
    formatKey: "disableAbilities"
  },
  "AbilSetId": functionTemplates.removeFromOutput,
  "Acceleration": functionTemplates.numberValue(),
  "AccelerationBonus": functionTemplates.numberValue(),
  "Accumulator": functionTemplates.mergeElement(ACCUMULATOR_TYPE_FILTER),
  "AccumulatorArray": functionTemplates.mergeElement(ACCUMULATOR_TYPE_FILTER),
  "Activity": functionTemplates.removeFromOutput,
  "ActorKey": functionTemplates.removeFromOutput,
  "AcquireFilters": functionTemplates.filters(),
  "AcquireLeashRadius": functionTemplates.numberValue(),
  "AcquirePlayer": returnEffectOrRemove,
  "AcquirePriority": functionTemplates.numberValue(),
  "AcquireTargetSorts": functionTemplates.removeFromOutput,
  "Active": functionTemplates.booleanValue(),
  "AddedThreat": functionTemplates.numberValue(),
  "AdditionalSearchText": functionTemplates.localeText(),
  "AdditiveAttackSpeedFactor": functionTemplates.numberValue(),
  "AdditiveMoveSpeedFactor": functionTemplates.numberValue(),
  "AffectedByAbilityPower": functionTemplates.booleanValue(),
  "AffectedByCooldownReduction": functionTemplates.booleanValue(),
  "AffectedByOverdrive": functionTemplates.booleanValue(),
  "AIBaseThreat": functionTemplates.removeFromOutput,
  "AIEvalFactor": functionTemplates.removeFromOutput,
  "AIHealthThresholds": functionTemplates.removeFromOutput,
  "AIOnly": functionTemplates.booleanValue(),
  "AIThinkTree": functionTemplates.removeFromOutput,
  "AIUtility": functionTemplates.removeFromOutput,
  "AlertName": functionTemplates.localeText(),
  "AlertTooltip": functionTemplates.parseTooltip(),
  "Alignment": functionTemplates.removeFromOutput,
  "AllArmorBonus": functionTemplates.numberValue(),
  "AlliedPushPriority": functionTemplates.numberValue(),
  "AlternateNameSearchText": functionTemplates.localeText(),
  "AlternateUnitArray": functionTemplates.mergeElement("CUnit"),
  "AmmoOwner": functionTemplates.singleElement,
  "AmmoUnit": functionTemplates.mergeElement("CUnit"),
  "Amount": functionTemplates.numberValue(),
  "AmountScoreArray": functionTemplates.removeFromOutput,
  "ApplicationRule": functionTemplates.singleElement,
  "Arc": functionTemplates.numberValue(),
  "ArcSlop": functionTemplates.numberValue(),
  "AreaArray": {
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey,
    ),
  },
  "ArmorModification": {
    ...functionTemplates.singleElement,
    formatKey: 'armor'
  },
  "ArmorMitigationTable": {
    ...functionTemplates.valuesToSingleObjectOfNumbers(),
    formatKey: 'armorType'
  },
  "ArmorSet": {
    formatKey: 'source'
  },
  "AtMaxEvents": functionTemplates.valueFromAttributeIfOnlyHasKeys('eventId'),
  "AtMinEvents": functionTemplates.valueFromAttributeIfOnlyHasKeys('eventId'),
  "AttackTargetPriority": functionTemplates.numberValue(),
  "AttributeFactor": {
    formatKey: 'factors'
  },
  "AttributeId": functionTemplates.removeFromOutput,
  "Attributes": functionTemplates.flags(true),
  "AutoCastAcquireLevel": functionTemplates.singleElement,
  "AutoCastFilters": functionTemplates.filters(),
  "AutoQueueArray": functionTemplates.flags(),
  "Backswing": functionTemplates.numberValue(),
  "Behavior": {
    merge: singleElement,
    preParse: parsers.join(
      parsers.defaultPreParser,
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName('CValidatorUnitCompareBehaviorCount'),
        conditionalParsers.passThrough,
        functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER).preParse
      ),
    ),
  },
  "BehaviorArray": {
    ...functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
    ...functionTemplates.valueFromAttributeIfOnlyHasKeys("link"),
    formatKey: "behaviors"
  },
  "BehaviorCategories": functionTemplates.flags(true),
  "BehaviorClass": functionTemplates.removeFromOutput,
  "BehaviorFlags": functionTemplates.flags(true),
  "BehaviorLink": functionTemplates.singleElementWithReplacement(),
  "BehaviorLinkDisableArray": {
    formatKey: "disableBehaviors",
  },
  "BehaviorState": functionTemplates.singleElement,
  "Birth": functionTemplates.removeFromOutput,
  "BuffFlags": functionTemplates.flags(true),
  "Button": functionTemplates.mergeElement("CButton"),
  "CAccumulatorTimed": functionTemplates.addAttribute('accumulator', 'timed'),
  "CanBeSuppressed": functionTemplates.flags(),
  "CancelableArray": functionTemplates.flags(),
  "CancelEffect": singleEffect,
  "CardLayouts": functionTemplates.removeFromOutput,
  "CargoSize": functionTemplates.numberValue(),
  "CaseArray": {
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "CaseDefault": {
    ...functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: "default",
  },
  "CastIntroTime": functionTemplates.numberValue(),
  "CastOutroTimeEffect": singleEffect,
  "Catalog": functionTemplates.singleElement,
  "CatalogModifications": {
    formatKey: 'modifications',
  },
  "Categories": functionTemplates.flags(),
  "CBehaviorBuff": functionTemplates.addAttribute("type", "buff"),
  "CBehaviorClickResponse": functionTemplates.removeFromOutput,
  "CBehaviorConjoined": functionTemplates.removeFromOutput,
  "CBehaviorCreepSource": functionTemplates.removeFromOutput,
  "CBehaviorHeroPlaystyle": functionTemplates.removeFromOutput,
  "CBehaviorReveal": functionTemplates.removeFromOutput,
  "CBehaviorTrail": functionTemplates.removeFromOutput,
  "CBehaviorThreat": functionTemplates.removeFromOutput,
  "CBehaviorTimeStamp": functionTemplates.removeFromOutput,
  "CValidatorUnitCompareBehaviorCount": {
    ...functionTemplates.addAttribute("type", "compareBehaviorCount"),
    formatElement: elementFormatters.join(
      elementFormatters.conditionallyFormatElement(
        elementFormatters.attributeIsDefined('value'),
        elementFormatters.passThrough,
        (formattedElement: any): any => {
          formattedElement.value = 1
          return formattedElement
        }
      ),
      elementFormatters.defaultElementFormatter
    )
  },
  "CBehaviorUnitTracker": functionTemplates.removeFromOutput,
  "CBehaviorWander": functionTemplates.removeFromOutput,
  "CEffectAbortMissle": functionTemplates.addAttribute('effectType', 'abortMissle'),
  "CEffectApplyForce": functionTemplates.addAttribute('effectType', 'applyForce'),
  "CEffectCancelOrder": functionTemplates.addAttribute('effectType', 'cancelOrder'),
  "CEffectDamage": functionTemplates.addAttribute('effectType', 'damage'),
  "CEffectDestroyPersistent": functionTemplates.addAttribute('effectType', 'destroyEffect'),
  "CEffectIssueOrder": functionTemplates.addAttribute('effectType', 'issueOrder'),
  "CEffectLaunchMissle": functionTemplates.addAttribute('effectType', 'launchMissle'),
  "CEffectLaunchMissleAdvanced": functionTemplates.addAttribute('effectType', 'launchMissle'),
  "CEffectModifyBehaviorBuffDuration": functionTemplates.addAttribute('effectType', 'modifyDuration'),
  "CEffectModifyTokenCount": functionTemplates.addAttribute('effectType', 'modifyToken'),
  "CEffectRemoveBehavior": functionTemplates.addAttribute('effectType', 'removeBehavior'),
  "CEffectRemoveKinetic": functionTemplates.addAttribute('effectType', 'removeBehavior'),
  "CEffectSet": {
    formatElement: elementFormatters.valueFromAttribute("effects")
  },
  "CEffectAddTrackedUnit": functionTemplates.addAttribute('effectType', 'addTrackedUnit'),
  "CEffectClearTrackedUnits": functionTemplates.addAttribute('effectType', 'clearTrackedUnits'),
  "CEffectRemoveTrackedUnit": functionTemplates.addAttribute('effectType', 'removeTrackedUnit'),
  "CEffectUseMagazine": functionTemplates.removeFromOutput,
  "Chance": functionTemplates.numberValue(),
  "ChanceArray": functionTemplates.valuesToSingleObject(),
  "Change": functionTemplates.numberValue(),
  "ChangeFraction": functionTemplates.numberValue(),
  "Charge": {
    ...functionTemplates.singleElement,
    formatElement: functionTemplates.numberValue().formatElement,
  },
  "ChargeLink": functionTemplates.singleElement,
  "CHero": {
    postParse: elementParsers.levelScalingParser,
    formatElement: elementFormatters.join(
      elementFormatters.defaultElementFormatter,
      elementFormatters.combineAttributes('units', 'unit', 'alternateUnit'),
      (formattedElement: any, element: any): any => {
        if(!formattedElement.talentTier || !formattedElement.talentTree) {
          return formattedElement
        }

        const tierMap = formattedElement.talentTier.reduce((map: Map<number, number>, tier: any) => {
          map.set(tier.tier, tier.level)
          return map
        }, new Map())

        const talentTree: { [level: number]: any } = {}

        formattedElement.talentTree.forEach((element: any) => {
          const tier = tierMap.get(element.tier)
          const talentTier = talentTree[tier] || []

          talentTier[element.column - 1] = element.talent
          talentTree[tier] = talentTier
        })

        delete formattedElement.talentTier
        delete formattedElement.talentTree

        formattedElement.talents = talentTree

        return formattedElement
      }
    )
  },
  "CItemAbil": functionTemplates.valueFromAttributeIfOnlyHasKeys("abil"),
  "ClampMinimum": functionTemplates.numberValue(),
  "Class": functionTemplates.removeFromOutput,
  "CollationId": functionTemplates.removeFromOutput,
  "CollectionCategory": functionTemplates.singleElement,
  "CollectionIcon": functionTemplates.singleAsset(),
  "Collide": functionTemplates.flags(),
  "Column": functionTemplates.numberValue(),
  "CombineArray": {
    ...functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
    formatKey: "validators"
  },
  "CombinedVital": returnEffectOrRemove,
  "CombinedVitalCompare": {
    ...functionTemplates.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute('value', elementFormatters.formatCompareOperator),
      elementFormatters.defaultElementFormatter,
    )
  },
  "Compare": {
    ...functionTemplates.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute('value', elementFormatters.formatCompareOperator),
      elementFormatters.defaultElementFormatter,
    )
  },
  "CompareValue": functionTemplates.numberValue(),
  "Complexity": functionTemplates.numberValue(),
  "ConjoinedFlags": functionTemplates.flags(true),
  "ContainsHeroic": {
    formatElement: elementFormatters.join(
      elementFormatters.attributeToBoolean('value', 'true', 'false'),
      elementFormatters.attributeToBoolean('value', '1', '0'),
      elementFormatters.defaultElementFormatter
    ),
  },
  "ContextUnit": returnEffectOrRemove,
  "Cooldown": functionTemplates.numberValue(),
  "CooldownAmount": functionTemplates.numberValue(),
  "CooldownLink": functionTemplates.singleElement,
  "CooldownFraction": functionTemplates.numberValue(),
  "CooldownOperation": functionTemplates.singleElement,
  "Copy": functionTemplates.booleanValue(),
  "Count": functionTemplates.numberValue(),
  "CountMax": functionTemplates.numberValue(),
  "CountStart": functionTemplates.numberValue(),
  "CountUse": functionTemplates.numberValue(),
  "CountEffect": singleEffect,
  "CreateFlags": functionTemplates.flags(),
  "CRequirementAnd": functionTemplates.addAttribute('operator', "and"),
  "CRequirementCountAbil": functionTemplates.addAttribute('operator', "countAbility"),
  "CRequirementCountBehavior": functionTemplates.addAttribute('operator', "countBehavior"),
  "CRequirementCountUnit": functionTemplates.addAttribute('operator', "countUnit"),
  "CRequirementCountUpgrade": functionTemplates.addAttribute('operator', "countUpgrade"),
  "CRequirementDiv": functionTemplates.addAttribute('operator', "divide"),
  "CRequirementEq": functionTemplates.addAttribute('operator', "=="),
  "CRequirementGT": functionTemplates.addAttribute('operator', ">"),
  "CRequirementGTE": functionTemplates.addAttribute('operator', ">="),
  "CRequirementLT": functionTemplates.addAttribute('operator', "<"),
  "CRequirementLTE": functionTemplates.addAttribute('operator', "<="),
  "CRequirementMod": functionTemplates.addAttribute('operator', "modulus"),
  "CRequirementMul": functionTemplates.addAttribute('operator', "multiply"),
  "CRequirementNE": functionTemplates.addAttribute('operator', "!="),
  "CRequirementNot": functionTemplates.addAttribute('operator', "not"),
  "CRequirementOdd": functionTemplates.addAttribute('operator', "odd"),
  "CRequirementOr": functionTemplates.addAttribute('operator', "or"),
  "CRequirementSum": functionTemplates.addAttribute('operator', "sum"),
  "CRequirementXor": functionTemplates.addAttribute('operator', "xor"),
  "CritStep": functionTemplates.numberValue(),
  "CritValidatorArray": functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
  "CursorEffect": singleEffect,
  "CursorRangeMode": functionTemplates.singleElement,
  "CValidatorPlayerAI": functionTemplates.removeFromOutput,
  "CValidatorPlayerTalent": {
    formatElement: elementFormatters.join(
      (formattedElement: any, element: any) => {
        formattedElement.talent = formattedElement.value
        formattedElement.hasTalent = !!formattedElement.find

        delete formattedElement.find
        delete formattedElement.value

        return formattedElement
      },
      elementFormatters.defaultElementFormatter
    )
  },
  "CValidatorUnitArmorLevel": functionTemplates.addAttribute('validates', 'armorAmount'),
  "CValidatorUnitCompareDamageTakenTime": functionTemplates.addAttribute('validates', 'damageTakenTime'),
  "CValidatorUnitCompareField": functionTemplates.addAttribute('validates', 'compareField'),
  "CValidatorUnitCompareKillCount": functionTemplates.addAttribute('validates', 'hasKills'),
  "CValidatorUnitCompareMarkerCount": functionTemplates.addAttribute('validates', 'markerCount'),
  "CValidatorUnitCompareOrderCount": functionTemplates.addAttribute('validates', 'orderCount'),
  "CValidatorUnitCompareSpeed": functionTemplates.addAttribute('validates', 'speed'),
  "CValidatorUnitCompareTargetRange": functionTemplates.addAttribute('validates', 'targetRange'),
  "CValidatorUnitCompareVital": functionTemplates.addAttribute('validates', 'vital'),
  "CValidatorUnitCompareVitality": functionTemplates.addAttribute('validates', 'vital'),
  "CValidatorUnitCompareWeaponLegacyState": {
    formatElement: elementFormatters.join(
      (formattedElement: any, element: any) => {
        formattedElement.state = formattedElement.value
        delete formattedElement.value
        return formattedElement
      },
      elementFormatters.defaultElementFormatter
    )
  },
  "CValidatorUnitIsHero": functionTemplates.addAttribute('targetIsHero', true),
  "CValidatorUnitMover": {
    formatElement: elementFormatters.join(
      (formattedElement: any, element: any) => {
        formattedElement.unitType = formattedElement.value
        formattedElement.movesUnit = !!formattedElement.find

        delete formattedElement.find
        delete formattedElement.value

        return formattedElement
      },
      elementFormatters.defaultElementFormatter
    )
  },
  "CValidatorUnitOrder": functionTemplates.removeFromOutput,
  "CValidatorUnitOrderQueue": functionTemplates.removeFromOutput,
  "CValidatorUnitOrderTargetType": functionTemplates.removeFromOutput,
  "CValidatorUnitTimeElapsed": functionTemplates.removeFromOutput,
  "CValidatorUnitType": {
    formatElement: elementFormatters.join(
      (formattedElement: any, element: any) => {
        formattedElement.unit = formattedElement.value
        formattedElement.isUnit = !!formattedElement.find

        delete formattedElement.find
        delete formattedElement.value

        return formattedElement
      },
      elementFormatters.defaultElementFormatter
    ),
  },
  "CValidatorUnitWeaponCanTargetUnit": functionTemplates.addAttribute('canTarget', true),
  "Damage": functionTemplates.numberValue(),
  "DamageDealtAdditiveMultiplier": functionTemplates.valuesToSingleObjectOfNumbers(),
  "DamageDealtFraction": functionTemplates.valuesToSingleObjectOfNumbers(),
  "DamageDealtScaled": functionTemplates.valuesToSingleObjectOfNumbers(),
  "DamageDealtXP": functionTemplates.booleanValue(),
  "DamageModifierSource": returnEffectOrRemove,
  "DamagePoint": functionTemplates.numberValue(),
  "DamageResponse": functionTemplates.singleElement,
  "DamageTakenXP": functionTemplates.booleanValue(),
  "Day": functionTemplates.numberValue(),
  "DeathRevealDuration": functionTemplates.removeFromOutput,
  "DeathRevealFilters": functionTemplates.removeFromOutput,
  "DeathRevealRadius": functionTemplates.removeFromOutput,
  "DeathRevealType": functionTemplates.removeFromOutput,
  "DeathTime": functionTemplates.numberValue(),
  "DeathType": returnEffectOrRemove,
  "DeathUnloadEffect": singleEffect,
  "DecreaseEvents": functionTemplates.valueFromAttributeIfOnlyHasKeys('eventId'),
  "DefaultAcquireLevel": functionTemplates.removeFromOutput,
  "DefaultError": functionTemplates.removeFromOutput,
  "Delay": functionTemplates.numberValue(),
  "DelayMax": functionTemplates.numberValue(),
  "DelayMin": functionTemplates.numberValue(),
  "Description": functionTemplates.localeText(),
  "DestructionFunction": functionTemplates.removeFromOutput,
  "Detect": functionTemplates.numberValue(),
  "Detected": functionTemplates.booleanValue(),
  "DetectFilters": functionTemplates.filters(),
  "Difficulty": {
    merge: singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute('value', elementFormatters.splitOnCaps),
      elementFormatters.defaultElementFormatter
    ),
  },
  "DisableValidatorArray": {
    formatKey: "disableValidators"
  },
  "DisplayAttackCount": functionTemplates.numberValue(),
  "DisplayDuration": functionTemplates.flags(),
  "DisplayEffect": singleEffect,
  "DisplayModel": functionTemplates.removeFromOutput,
  "DisplayPriority": functionTemplates.numberValue(),
  "Distance": functionTemplates.numberValue(),
  "DistanceMax": functionTemplates.numberValue(),
  "DistanceMin": functionTemplates.numberValue(),
  "DraftCutsceneFile": functionTemplates.removeFromOutput,
  "DraftPickCutsceneFile": functionTemplates.removeFromOutput,
  "DraftScreenLargeImage": functionTemplates.singleAsset(),
  "DraftScreenLargeImageBackground": functionTemplates.singleAsset(),
  "DraftScreenPortrait": functionTemplates.singleAsset(),
  "DraftScreenPortraitBackground": functionTemplates.singleAsset(),
  "Duration": functionTemplates.numberValue(),
  "DurationBonusMax": functionTemplates.numberValue(),
  "DurationBonusMin": functionTemplates.numberValue(),
  "EditorCategories": functionTemplates.removeFromOutput,
  "EditorFlags": functionTemplates.removeFromOutput,
  "Effect": {
    ...functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
    merge: singleElement,
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "EffectArray": {
    ...functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "EffectCategory": functionTemplates.flags(),
  "EffectHistoryLimit": functionTemplates.valuesToSingleObjectOfNumbers(),
  "EffectRange": {
    ...functionTemplates.singleElement,
    formatElement: elementFormatters.join(
      (formattedElement: any) => {
        const [ min, max ] = formattedElement.value.split(',')
        delete formattedElement.value

        formattedElement.minRange = min
        formattedElement.maxRange = max
        return formattedElement
      },
      elementFormatters.attributeToNumber('minRange'),
      elementFormatters.attributeToNumber('maxRange'),
      elementFormatters.defaultElementFormatter
    )
  },
  "Enabled": functionTemplates.booleanValue(),
  "EndOfMatchCutsceneFile": functionTemplates.removeFromOutput,
  "Energy": functionTemplates.numberValue(),
  "EnergyMax": functionTemplates.numberValue(),
  "EnergyStart": functionTemplates.numberValue(),
  "EnergyRegenRate": functionTemplates.numberValue(),
  "Entry": functionTemplates.singleElement,
  "ErrorAlert": functionTemplates.removeFromOutput,
  "EventName": functionTemplates.singleElement,
  "ExcludeCasterUnit": returnEffectOrRemove,
  "ExcludeOriginPlayer": returnEffectOrRemove,
  "ExecuteUnitAutoQueueId": functionTemplates.removeFromOutput,
  "Exhausted": singleEffect,
  "ExpireDelay": functionTemplates.numberValue(),
  "ExpireEffect": singleEffect,
  "Face": {
    merge: singleElement,
    preParse: conditionalParsers.conditionallyParseElement(
      conditionalParsers.outerElementHasName(elementNameFilters.join(
        ITEM_TYPE_FILTER,
        elementNameFilters.inList('CUnit', 'TooltipAppender')
      )),
      parsers.defaultPreParser,
      functionTemplates.mergeElement("CButton").preParse
    ),
    formatKey: "button",
  },
  "FacingLocation": returnEffectOrRemove,
  "Fatal": functionTemplates.booleanValue(),
  "FeatureArray": {
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute('value', elementFormatters.splitOnCaps),
      elementFormatters.defaultElementFormatter
    ),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "Fidget": functionTemplates.removeFromOutput,
  "Field": functionTemplates.singleElement,
  "FieldIsInteger": functionTemplates.booleanValue(),
  "Filters": functionTemplates.filters(),
  "FinalEffect": singleEffect,
  "Find": functionTemplates.booleanValue(),
  "FinishTime": functionTemplates.numberValue(),
  "Flags": functionTemplates.flags(true),
  "FlagArray": functionTemplates.flags(true),
  "FleeTime": functionTemplates.numberValue(),
  "FleeRange": functionTemplates.numberValue(),
  "FloaterCreation": returnEffectOrRemove,
  "FollowRange": functionTemplates.numberValue(),
  "Fraction": functionTemplates.singleElement,
  "Gender": functionTemplates.singleElement,
  "Grown": functionTemplates.removeFromOutput,
  "Handled": singleEffect,
  "HasShield": functionTemplates.booleanValue(),
  "HealDealtAdditiveMultiplier": functionTemplates.valuesToSingleObjectOfNumbers(),
  "Height": functionTemplates.numberValue(),
  "HeroAbilArray": {
    formatKey: "abilities",
  },
  "HeroArray": functionTemplates.mergeElement("CHero"),
  "HeroPlaystyleFlags": functionTemplates.flags(),
  "HeroPoseAnimGroup": {
    ...functionTemplates.singleElement,
    formatKey: "heroPose"
  },
  "HeroSelectCutsceneFile": functionTemplates.removeFromOutput,
  "HeroSpecificUIArray": functionTemplates.removeFromOutput,
  "HeroTierAchievementId": functionTemplates.removeFromOutput,
  "HomeScreenCutsceneFile": functionTemplates.removeFromOutput,
  "HitMask": functionTemplates.flags(),
  "HitsChangedEffect": singleEffect,
  "Hotkey": functionTemplates.removeFromOutput,
  "HotkeyAlias": functionTemplates.removeFromOutput,
  "HyperlinkId": functionTemplates.removeFromOutput,
  "Icon": functionTemplates.singleAsset(),
  "IgnoreRange": functionTemplates.numberValue(),
  "ImageFacing": functionTemplates.singleElement,
  "ImpactEffect": singleEffect,
  "ImpactFilters": functionTemplates.flags(),
  "ImpactLocation": returnEffectOrRemove,
  "ImpactUnit": returnEffectOrRemove,
  "IncreaseEvents": functionTemplates.valueFromAttributeIfOnlyHasKeys('eventId'),
  "IndexArray": functionTemplates.removeFromOutput,
  "InfoFlags": functionTemplates.flags(true),
  "InfoIcon": functionTemplates.singleAsset(),
  "InfoText": functionTemplates.localeText(),
  "InfoTooltipPriority": functionTemplates.numberValue(),
  "InGameUnitStatusCutsceneFile": functionTemplates.removeFromOutput,
  "Init": functionTemplates.numberValue(),
  "InitialDelay": functionTemplates.numberValue(),
  "InitialEffect": {
    ...functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
    merge: singleElement,
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "InitializerFunction": functionTemplates.removeFromOutput,
  "InnerRadius": functionTemplates.numberValue(),
  "InnerRadiusSafetyMultiplier": functionTemplates.numberValue(),
  "InterruptArray": functionTemplates.flags(),
  "InterruptCost": functionTemplates.singleElement,
  "Item": functionTemplates.mergeElement(
    elementNameFilters.join(
      ITEM_TYPE_FILTER,
      elementNameFilters.inList('CUnit')
    )
  ),
  "KillCredit": returnEffectOrRemove,
  "KillCreditUnit": returnEffectOrRemove,
  "KillXPBonus": functionTemplates.numberValue(),
  "Kind": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined("index"),
      elementFormatters.join(
        elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
        elementFormatters.attributeToNumber(),
        elementFormatters.toKeyValuePair(),
      ),
      elementFormatters.defaultElementFormatter
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.allHaveAttribute('index'),
      arrayFormatters.reduceToSingleObject(),
      arrayFormatters.lastValue
    )
  },
  "KindArray": {
    formatElement: elementFormatters.join(
      elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
      elementFormatters.attributeToNumber(),
      elementFormatters.toKeyValuePair(),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "KindSplash": functionTemplates.singleElement,
  "Kinetic": functionTemplates.mergeElement(KINETIC_TYPE_FILTER),
  "LateralAcceleration": functionTemplates.numberValue(),
  "LastAttackTargetUnit": returnEffectOrRemove,
  "Launch": functionTemplates.removeFromOutput,
  "LaunchEffect": singleEffect,
  "LaunchLocation": returnEffectOrRemove,
  "LaunchMissileEffect": singleEffect,
  "LaunchUnit": returnEffectOrRemove,
  "LayoutButtons": functionTemplates.removeFromOutput,
  "LeaderAlias": functionTemplates.removeFromOutput,
  "LeaderboardImage": functionTemplates.singleAsset(),
  "Leash": functionTemplates.numberValue(),
  "LeechScoreArray": functionTemplates.removeFromOutput,
  "LegacyOptions": functionTemplates.flags(),
  "Level": functionTemplates.numberValue(),
  "LifeMax": functionTemplates.numberValue(),
  "LifeRegenMax": functionTemplates.numberValue(),
  "LifeRegenRate": functionTemplates.numberValue(),
  "LifeStart": functionTemplates.numberValue(),
  "LineDashType": functionTemplates.singleElement,
  "Link": {
    preParse: parsers.join(
      parsers.defaultPreParser,
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName('WeaponArray'),
        functionTemplates.mergeElement(WEAPON_TYPE_FILTER).preParse
      ),
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName('NodeArray'),
        functionTemplates.mergeElement(REQUIREMENT_TYPE_FILTER).preParse
      ),
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName('BehaviorArray'),
        functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER).preParse
      )
    )
  },
  "LoadCargoEffect": singleEffect,
  "LoadingScreenImage": functionTemplates.singleAsset(),
  "LoadTransportBehavior": functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
  "Location": functionTemplates.singleElement,
  "LoiterInnerRadius": functionTemplates.numberValue(),
  "LoiterRadius": functionTemplates.numberValue(),
  "LootChestRewardCutsceneFile": functionTemplates.removeFromOutput,
  "Mass": functionTemplates.numberValue(),
  "Max": functionTemplates.numberValue(),
  "MaxAccumulation": functionTemplates.numberValue(),
  "MaxAttackSpeedMultiplier": functionTemplates.numberValue(),
  "MaxCargoCount": functionTemplates.numberValue(),
  "MaxCargoSize": functionTemplates.numberValue(),
  "MaxCount": functionTemplates.numberValue(),
  "MaxCountError": functionTemplates.singleElement,
  "MaxStackCount": functionTemplates.numberValue(),
  "MaxStepCount": functionTemplates.numberValue(),
  "MaxUnloadRange": functionTemplates.numberValue(),
  "Melee": functionTemplates.booleanValue(),
  "MinAccumulation": functionTemplates.numberValue(),
  "MinAttackSpeedMultiplier": functionTemplates.numberValue(),
  "MinCountError": functionTemplates.removeFromOutput,
  "MinDistanceRadiusMultiplier": functionTemplates.numberValue(),
  "MiniPortraitCutsceneFile": functionTemplates.removeFromOutput,
  "MinimapRadius": functionTemplates.numberValue(),
  "MinimumRange": functionTemplates.numberValue(),
  "MinPatrolDistance": functionTemplates.numberValue(),
  "MinScanRange": functionTemplates.numberValue(),
  "MinStackCountDisplayed": functionTemplates.numberValue(),
  "MinVeterancyXP": functionTemplates.numberValue(),
  "Missing": functionTemplates.booleanValue(),
  "Model": functionTemplates.removeFromOutput,
  "ModelGroups": functionTemplates.removeFromOutput,
  "ModelMacroRun": functionTemplates.removeFromOutput,
  "ModifiedAbilButton": functionTemplates.removeFromOutput,
  "Modification": functionTemplates.singleElement,
  "ModificationType": functionTemplates.singleElement,
  "Modifications": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.some(
        elementFormatters.attributeHasValue("Actor", "catalog"),
        elementFormatters.attributeHasValue("Model", "catalog"),
        elementFormatters.attributeHasValue("Sound", "catalog"),
        elementFormatters.attributeHasValue("Game", "catalog"),
      ),
      elementFormatters.removeFromOutput
    ),
  },
  "ModifyFlags": functionTemplates.flags(true),
  "ModifyFraction": functionTemplates.numberValue(),
  "ModifyLimit": functionTemplates.numberValue(),
  "ModifyLimitVitalMaxFractionArray": functionTemplates.valuesToSingleObjectOfNumbers(),
  "ModifyMinimumDamage": functionTemplates.numberValue(),
  "ModifyOwnerPlayer": returnEffectOrRemove,
  "ModifyScoreArray": functionTemplates.arrayOfNumberValues("Value"),
  "Month": functionTemplates.numberValue(),
  "MountArray": {
    preParse: parsers.join(
      parsers.defaultPreParser,
      mergeParsers.mergeElementFromInnerElementValue("CMount", "Mount")
    ),
  },
  "MountCategory": {
    ...functionTemplates.singleElement,
    formatKey: "category",
  },
  "Mover": functionTemplates.singleElement,
  "MoveFilters": functionTemplates.filters(),
  "MoveSpeedBonus": functionTemplates.numberValue(),
  "MultiplierPerStep": functionTemplates.numberValue(),
  "Name": functionTemplates.localeText(),
  "Negate": functionTemplates.booleanValue(),
  "OccludeHeight": functionTemplates.numberValue(),
  "OffCost": {
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "OffsetFacingFallback": functionTemplates.removeFromOutput,
  "Offsets": functionTemplates.removeFromOutput,
  "OffsetVectorEndLocation": functionTemplates.removeFromOutput,
  "OffsetVectorStartLocation": functionTemplates.removeFromOutput,
  "OperandArray": functionTemplates.mergeElement(REQUIREMENT_TYPE_FILTER),
  "Operation": functionTemplates.singleElement,
  "Options": functionTemplates.flags(),
  "OrderArray": functionTemplates.removeFromOutput,
  "OriginalAbilButton": functionTemplates.removeFromOutput,
  "Origin": returnEffectOrRemove,
  "OtherBehavior": functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
  "OtherLocation": returnEffectOrRemove,
  "OtherPlayer": returnEffectOrRemove,
  "OtherUnit": returnEffectOrRemove,
  "OverlapIndex": functionTemplates.singleElement,
  "ParentAbil": functionTemplates.singleElement,
  "PartyFrameImage": functionTemplates.singleAsset(),
  "PartyPanelButtonImage": functionTemplates.singleAsset(),
  "PauseableArray": functionTemplates.flags(),
  "Period": functionTemplates.numberValue(),
  "PeriodCount": functionTemplates.numberValue(),
  "PeriodicEffect": singleEffect,
  "PeriodicEffectArray": {
    ...functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "PeriodicPeriod": functionTemplates.numberValue(),
  "PeriodicPeriodArray": functionTemplates.arrayOfNumberValues(),
  "PeriodicOffsetArray": functionTemplates.removeFromOutput,
  "PeriodMax": functionTemplates.numberValue(),
  "PeriodMin": functionTemplates.numberValue(),
  "Placeholder": functionTemplates.removeFromOutput,
  "PlacementArc": functionTemplates.numberValue(),
  "PlacementAround": returnEffectOrRemove,
  "PlacementRange": functionTemplates.numberValue(),
  "Plane": functionTemplates.removeFromOutput,
  "PlaneArray": functionTemplates.removeFromOutput,
  "PlaneDelta": functionTemplates.removeFromOutput,
  "Player": functionTemplates.removeIfValue('Unknown'),
  "Portrait": functionTemplates.singleAsset(),
  "PreemptableArray": functionTemplates.flags(),
  "PrepEffect": singleEffect,
  "PreswingBeforeAttack": functionTemplates.numberValue(),
  "PreswingBetweenAttacks": functionTemplates.numberValue(),
  "PreviewCutsceneFile": functionTemplates.removeFromOutput,
  "Priority": functionTemplates.numberValue(),
  "ProductId": functionTemplates.removeFromOutput,
  "ProgressionLootChestReward": functionTemplates.removeFromOutput,
  "ProjectionDistanceScale": functionTemplates.numberValue(),
  "ProjectionMultiplier": functionTemplates.numberValue(),
  "ProjectionSourceValue": functionTemplates.singleElement,
  "ProjectionTargetValue": functionTemplates.singleElement,
  "ProvideCategories": functionTemplates.flags(),
  "PurchaseWarningCondition": functionTemplates.removeFromOutput,
  "PushPriority": functionTemplates.numberValue(),
  "Radar": functionTemplates.numberValue(),
  "RadarFilters": functionTemplates.filters(),
  "Radius": functionTemplates.numberValue(),
  "RandomDelayMax": functionTemplates.numberValue(),
  "RandomDelayMin": functionTemplates.numberValue(),
  "Range": functionTemplates.numberValue(),
  "RangeSlop": functionTemplates.numberValue(),
  "Rarity": functionTemplates.singleElement,
  "Ratings": functionTemplates.singleElement,
  "RankArray": functionTemplates.valueFromAttributeIfOnlyHasKeys('item'),
  "Ratio": functionTemplates.numberValue(),
  "RechargeVital": functionTemplates.singleElement,
  "RechargeVitalRate": {
    merge: singleElement,
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.hasKeys('accumulator'),
      elementFormatters.valueFromAttribute('accumulator'),
      functionTemplates.numberValue().formatElement
    )
  },
  "RechargeVitalFraction": functionTemplates.numberValue(),
  "RectangleHeight": functionTemplates.numberValue(),
  "RectangleWidth": functionTemplates.numberValue(),
  "Reference": {
    merge: singleElement,
    formatElement: elementFormatters.join(
      (formattedElement: any, element: any): any => {
        const [ catalog, entry, field ] = formattedElement.value.split(',')
        delete formattedElement.value
        return Object.assign(formattedElement, {
          catalog,
          entry,
          field,
        })
      },
      elementFormatters.conditionallyFormatElement(
        elementFormatters.attributeHasValue('Actor', 'catalog'),
        elementFormatters.removeFromOutput
      )
    ),
  },
  "RefreshEffect": singleEffect,
  "RefundArray": functionTemplates.flags(),
  "RefundFraction": functionTemplates.singleElement,
  "Relationship": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined('index'),
      elementFormatters.join(
        elementFormatters.attributeToBoolean(),
        elementFormatters.toKeyValuePair(),
      ),
      elementFormatters.defaultElementFormatter
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.allHaveAttribute("index"),
      arrayFormatters.combineBy("index"),
      arrayFormatters.defaultArrayFormatter
    )
  },
  "ReleaseDate": functionTemplates.singleElement,
  "RemoveValidatorArray": {
    formatKey: "removeValidators"
  },
  "RepairTime": functionTemplates.numberValue(),
  "ReplacementArray": functionTemplates.removeFromOutput,
  "RequireAccess": functionTemplates.booleanValue(),
  "RequireCaster": returnEffectOrRemove,
  "RequireCasterUnit": returnEffectOrRemove,
  "Requirements": functionTemplates.mergeElement(REQUIREMENT_TYPE_FILTER),
  "RequireOriginPlayer": returnEffectOrRemove,
  "RequiredRewardArray": functionTemplates.removeFromOutput,
  "Response": functionTemplates.singleElement,
  "ResponseFlags": functionTemplates.removeFromOutput,
  "ResultFailed": functionTemplates.removeFromOutput,
  "ResultFallback": functionTemplates.removeFromOutput,
  "ResultNoEffect": functionTemplates.removeFromOutput,
  "ResultNoUnit": functionTemplates.removeFromOutput,
  "RevealUnit": returnEffectOrRemove,
  "RevealRadius": functionTemplates.numberValue(),
  "RevealFlags": functionTemplates.flags(),
  "ReviveInfoBase": functionTemplates.removeFromOutput,
  "ReviveType": functionTemplates.singleElementWithReplacement(),
  "Role": functionTemplates.singleElement,
  "RolesMultiClass": functionTemplates.singleElement,
  "RoleScoreValueOverride": functionTemplates.singleElement,
  "Row": functionTemplates.numberValue(),
  "Scale": functionTemplates.numberValue(),
  "ScoreResult": functionTemplates.singleElement,
  "ScoreScreenCutsceneFile": functionTemplates.removeFromOutput,
  "ScoreScreenImage": functionTemplates.singleAsset(),
  "SelectAlias": functionTemplates.removeFromOutput,
  "SelectUnit": returnEffectOrRemove,
  "SelfReviveCmd": functionTemplates.singleElement,
  "SeparationRadius": functionTemplates.numberValue(),
  "SearchFilters": functionTemplates.filters(),
  "SearchFlags": functionTemplates.flags(),
  "SearchRadius": functionTemplates.numberValue(),
  "SelectScreenButtonImage": functionTemplates.singleAsset(),
  "SelectTransferUnit": returnEffectOrRemove,
  "SetLastTarget": returnEffectOrRemove,
  "ShapeExpansion": functionTemplates.numberValue(),
  "SharedFlags": functionTemplates.flags(),
  "SharedListPersistsForever": functionTemplates.booleanValue(),
  "ShieldRegenDelay": functionTemplates.numberValue(),
  "ShieldRegenRate": functionTemplates.numberValue(),
  "ShowInUI": functionTemplates.booleanValue("value", "True", "False"),
  "ShowProgressArray": functionTemplates.flags(),
  "Sight": functionTemplates.numberValue(),
  "SightMaximum": functionTemplates.numberValue(),
  "SimpleDisplayText": functionTemplates.localeText(),
  "SkinArray": {
    ...functionTemplates.mergeElement("CSkin"),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "SmartFilters": functionTemplates.filters(),
  "SmartPriority": functionTemplates.numberValue(),
  "SmartValidatorArray": functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
  "SpawnCount": functionTemplates.numberValue(),
  "SpawnEffect": singleEffect,
  "SpawnRange": functionTemplates.numberValue(),
  "SpawnUnit": functionTemplates.mergeElement("CUnit"),
  "Speed": functionTemplates.numberValue(),
  "SpeedMax": functionTemplates.numberValue(),
  "SpeedMultiplierCreep": functionTemplates.numberValue(),
  "SplashHistory": functionTemplates.singleElement,
  "SortName": functionTemplates.localeText(),
  "SortIndex": functionTemplates.numberValue(),
  "Source": functionTemplates.singleElement,
  "SourceButtonFace": functionTemplates.singleElement,
  "SourceEffect": functionTemplates.singleElement,
  "StackBonus": functionTemplates.numberValue(),
  "Start": functionTemplates.removeFromOutput,
  "State": functionTemplates.singleElement,
  "StateFlags": functionTemplates.flags(),
  "StationaryTurningRate": functionTemplates.numberValue(),
  "StepDistance": functionTemplates.numberValue(),
  "StepLoops": functionTemplates.numberValue(),
  "SubgroupAlias": functionTemplates.removeFromOutput,
  "SubgroupPriority": functionTemplates.numberValue(),
  "SucceedIfBehaviorLacksDuration": functionTemplates.booleanValue(),
  "SucceedIfUnitLacksBehavior": functionTemplates.booleanValue(),
  "SupportedFilters": functionTemplates.filters(),
  "SuppressFloatersCausedByBehavior": functionTemplates.booleanValue(),
  "Survivability": functionTemplates.numberValue(),
  "TacticalAIFilters": functionTemplates.filters(),
  "Talent": functionTemplates.mergeElement("CTalent"),
  "TalentAIBuildsArray": {
    formatKey: "AIBuilds",
  },
  "TalentsArray": functionTemplates.arrayOfSingleValues(),
  "Target": returnEffectOrRemove,
  "TargetCursorInfo": functionTemplates.removeFromOutput,
  "TargetFilters": {
    merge: singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute("value", elementFormatters.parseFilterString),
      elementFormatters.defaultElementFormatter
    )
  },
  "TargetingHitTestPriority": functionTemplates.removeFromOutput,
  "TargetLocation": returnEffectOrRemove,
  "TargetMessage": functionTemplates.localeText(),
  "TargetSorts": functionTemplates.removeFromOutput,
  "TargetType": functionTemplates.removeFromOutput,
  "TauntDoesntStopUnit": functionTemplates.flags(),
  "TauntDuration": functionTemplates.valuesToSingleObjectOfNumbers(),
  "TeleportEffect": singleEffect,
  "TeleportFlags": functionTemplates.flags(true),
  "TeleportResetRange": functionTemplates.numberValue(),
  "Text": functionTemplates.parseTooltip(),
  "Tier": functionTemplates.numberValue(),
  "TileCutsceneFile": functionTemplates.removeFromOutput,
  "TimeScaleSource": returnEffectOrRemove,
  "TimestampBehavior": functionTemplates.removeFromOutput,
  "TimeStart": functionTemplates.numberValue(),
  "TimeUse": functionTemplates.numberValue(),
  "Tip": functionTemplates.localeText(),
  "Title": functionTemplates.localeText(),
  "TokenId": functionTemplates.singleElementWithReplacement(),
  "Tooltip": functionTemplates.parseTooltip(),
  "TooltipAddendum": functionTemplates.parseTooltip(),
  "TooltipFlags": functionTemplates.flags(),
  "TooltipVitalName": functionTemplates.localeTextToSingleObject(),
  "TotalCargoSpace": functionTemplates.numberValue(),
  "TrackedUnit": functionTemplates.singleElement,
  "TrackedUnitFilters": functionTemplates.filters(),
  "TrackerUnit": functionTemplates.singleElement,
  "TrackingBehavior": functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
  "Trait": functionTemplates.booleanValue(),
  "TurnAngle": functionTemplates.numberValue(),
  "TurningRate": functionTemplates.numberValue(),
  "Type": functionTemplates.singleElement,
  "TypeFallbackUnit": functionTemplates.singleElement,
  "Types": functionTemplates.flags(),
  "UnifiedMoveSpeedFactor": functionTemplates.numberValue(),
  "Unit": {
    preParse: parsers.join(
      parsers.defaultPreParser,
      textParsers.attributeValueReplacement(),
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName('CValidatorLocationPlacement'),
        conditionalParsers.passThrough,
        mergeParsers.mergeElement("CUnit")
      ),
    )
  },
  "UninterruptibleArray": functionTemplates.flags(),
  "UninterruptibleDelay": functionTemplates.numberValue(),
  "UninterruptibleDuration": functionTemplates.numberValue(),
  "UnitDamageType": functionTemplates.singleElement,
  "Universe": functionTemplates.singleElement,
  "UniverseIcon": functionTemplates.singleAsset(),
  "UnloadCargoEffect": singleEffect,
  "UnloadPeriod": functionTemplates.numberValue(),
  "UpdateAttackSpeedEachFrame": functionTemplates.booleanValue(),
  "UseHotkeyLabel": functionTemplates.removeFromOutput,
  "UseMarkerArray": functionTemplates.flags(),
  "UseSharedList": functionTemplates.booleanValue(),
  "UsesLineDash": functionTemplates.booleanValue(),
  "Utility": functionTemplates.numberValue(),
  "ValidatedArray": functionTemplates.flags(),
  "Validator": functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
  "ValidatorArray": functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
  "Value": functionTemplates.numberValue(),
  "VariationArray": {
    preParse: mergeParsers.mergeElement("CSkin"),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "VariationIcon": functionTemplates.singleAsset(),
  "VertexArray": functionTemplates.removeFromOutput,
  "Visibility": functionTemplates.singleElement,
  "Vital": functionTemplates.valuesToSingleObject(),
  "VitalArray": {
    formatKey: "vitals"
  },
  "VitalMaxArray": {
    ...functionTemplates.valuesToSingleObjectOfNumbers(),
    formatKey: "vitalMaxModification"
  },
  "VitalMaxIncreaseAffectsCurrentArray": functionTemplates.flags(),
  "VitalType": functionTemplates.singleElement,
  "VOArray": {
    ...functionTemplates.assetArrayToSingleObject(),
    formatKey: "voiceOver",
  },
  "VODefinition": {
    ...functionTemplates.singleElementWithReplacement(),
    formatKey: "VODefinition",
  },
  "VoiceLineArray": {
    preParse: textParsers.attributeValueReplacement(),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "WalkAnimMoveSpeed": functionTemplates.numberValue(),
  "WeaponArray": {
    ...functionTemplates.mergeElement(WEAPON_TYPE_FILTER),
    formatElement: elementFormatters.join(
      functionTemplates.valueFromAttributeIfOnlyHasKeys('link').formatElement,
      functionTemplates.mergeElement(WEAPON_TYPE_FILTER).formatElement
    )
  },
  "WeaponDisableArray": {
    ...functionTemplates.numberValue(),
    formatKey: "disableWeapons",
  },
  "WeaponRange": functionTemplates.numberValue(),
  "WeaponScanBonus": functionTemplates.numberValue(),
  "WhichEffect": singleEffect,
  "WhichLocation": returnEffectOrRemove,
  "WhichPlayer": returnEffectOrRemove,
  "WhichUnit": returnEffectOrRemove,
  "WithPlayer": returnEffectOrRemove,
  "XPFraction": functionTemplates.valuesToSingleObjectOfNumbers(),
  "Year": functionTemplates.numberValue(),
}
