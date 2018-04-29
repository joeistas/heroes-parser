import { ElementFunctions, getElement } from "../element"
import { ParseData } from "../parse-data"
import * as parsers from "../parsers"
import * as addParsers from "../parsers/add-parsers"
import * as assetParsers from "../parsers/asset-parsers"
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
}

export const DETAILED_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
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
    ...functionTemplates.valueFromAttributeIfOnlyKey("link"),
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

  },
  "AbilityStage": functionTemplates.singleElement,
  "AbilLinkDisableArray": {
    ...functionTemplates.arrayOfSingleValues(),
    formatKey: "disableAbilities"
  },
  "AbilSetId": functionTemplates.removeFromOutput,
  "Acceleration": functionTemplates.numberValue(),
  "AccelerationBonus": functionTemplates.numberValue(),
  "AccumulatorArray": functionTemplates.mergeElement(ACCUMULATOR_TYPE_FILTER),
  "Activity": functionTemplates.removeFromOutput,
  "ActorKey": functionTemplates.removeFromOutput,
  "AcquireFilters": functionTemplates.flags(),
  "AcquireLeashRadius": functionTemplates.numberValue(),
  "AcquirePlayer": functionTemplates.removeIfValue("Unknown"),
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
  "AlertTooltip": functionTemplates.localeText(),
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
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "AtMaxEvents": functionTemplates.valueFromAttributeIfOnlyKey('eventId'),
  "AtMinEvents": functionTemplates.valueFromAttributeIfOnlyKey('eventId'),
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
    ...functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
    merge: singleElement,
  },
  "BehaviorArray": {
    ...functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
    ...functionTemplates.valueFromAttributeIfOnlyKey("link"),
    formatKey: "behaviors"
  },
  "BehaviorCategories": {
    ...functionTemplates.flags(),
    formatKey: "categories",
  },
  "BehaviorClass": functionTemplates.removeFromOutput,
  "BehaviorFlags": functionTemplates.flags(true),
  "BehaviorLink": functionTemplates.singleElementWithReplacement(),
  "BehaviorLinkDisableArray": {
    formatKey: "disableBehaviors",
  },
  "BehaviorState": functionTemplates.singleElement,
  "Birth": functionTemplates.removeFromOutput,
  "BuffFlags": functionTemplates.flags(true),
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
  "CBehaviorCreepSource": functionTemplates.removeFromOutput,
  "CBehaviorHeroPlaystyle": functionTemplates.removeFromOutput,
  "CBehaviorTrail": functionTemplates.removeFromOutput,
  "CBehaviorUnitTracker": functionTemplates.removeFromOutput,
  "CBehaviorThreat": functionTemplates.removeFromOutput,
  "CBehaviorTimeStamp": functionTemplates.removeFromOutput,
  "CEffectAbortMissle": functionTemplates.addAttribute('effectType', 'abortMissle'),
  "CEffectApplyForce": functionTemplates.addAttribute('effectType', 'applyForce'),
  "CEffectCancelOrder": functionTemplates.addAttribute('effectType', 'cancelOrder'),
  "CEffectDamage": functionTemplates.addAttribute('effectType', 'damage'),
  "CEffectDestroyPersistent": functionTemplates.addAttribute('effectType', 'destroyEffect'),
  "CEffectIssueOrder": functionTemplates.addAttribute('effectType', 'issueOrder'),
  "CEffectLaunchMissle": functionTemplates.addAttribute('effectType', 'launchMissle'),
  "CEffectLaunchMissleAdvanced": functionTemplates.addAttribute('effectType', 'launchMissle'),
  "CEffectModifyBehaviorBuffDuration": functionTemplates.addAttribute('effectType', 'modifyDuration'),
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
  "Charge": functionTemplates.singleElement,
  "ChargeLink": functionTemplates.singleElement,
  "CItemAbil": functionTemplates.valueFromAttributeIfOnlyKey("abil"),
  "ClampMinimum": functionTemplates.numberValue(),
  "Class": functionTemplates.removeFromOutput,
  "CollationId": functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
  "CollectionCategory": functionTemplates.singleElement,
  "CollectionIcon": functionTemplates.singleAsset(),
  "Collide": functionTemplates.flags(),
  "Column": functionTemplates.numberValue(),
  "CombineArray": {
    ...functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
    formatKey: "validators"
  },
  "CombinedVital": functionTemplates.removeIfValue("Unknown"),
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
  "ContextUnit": functionTemplates.removeIfValue("Unknown"),
  "Cooldown": functionTemplates.numberValue(),
  "CooldownLink": functionTemplates.singleElement,
  "CooldownFraction": functionTemplates.numberValue(),
  "CooldownOperation": functionTemplates.singleElement,
  "Copy": functionTemplates.booleanValue(),
  "Cost": {
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "Count": functionTemplates.booleanValue(),
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
  "CritValidator": functionTemplates.mergeElement(VALIDATOR_TYPE_FILTER),
  "CSkin": {

  },
  "CursorRangeMode": functionTemplates.singleElement,
  "CValidatorIsUnitTracked": {
    // formatElement: elementFormatters.join(
    //   (formattedElement: any, element: any) => {
    //     formattedElement.tracked = formattedElement.find
    //     delete formattedElement.find
    //     return formattedElement
    //   },
    //   elementFormatters.defaultElementFormatter
    // )
  },
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
  "CValidatorUnitIsHero": functionTemplates.addAttribute('isHero', true),
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
  "DamageModifierSource": functionTemplates.removeIfValue("Unknown"),
  "DamagePoint": functionTemplates.numberValue(),
  "DamageResponse": functionTemplates.singleElement,
  "DamageTakenXP": functionTemplates.booleanValue(),
  "Day": functionTemplates.numberValue(),
  "DeathRevealDuration": functionTemplates.removeFromOutput,
  "DeathRevealFilters": functionTemplates.removeFromOutput,
  "DeathRevealRadius": functionTemplates.removeFromOutput,
  "DeathRevealType": functionTemplates.removeFromOutput,
  "DeathTime": functionTemplates.numberValue(),
  "DeathType": functionTemplates.removeIfValue("Unknown"),
  "DeathUnloadEffect": singleEffect,
  "DecreaseEvents": functionTemplates.valueFromAttributeIfOnlyKey('eventId'),
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
  "DisplayDuration": functionTemplates.flags(),
  "DisplayEffect": singleEffect,
  "DisplayModel": functionTemplates.removeFromOutput,
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
  "EnergyMax": functionTemplates.numberValue(),
  "EnergyStart": functionTemplates.numberValue(),
  "EnergyRegenRate": functionTemplates.numberValue(),
  "Entry": functionTemplates.singleElement,
  "ErrorAlert": functionTemplates.removeFromOutput,
  "EventName": functionTemplates.singleElement,
  "ExcludeCasterUnit": functionTemplates.removeIfValue("Unknown"),
  "ExcludeOriginPlayer": functionTemplates.removeIfValue("Unknown"),
  "ExecuteUnitAutoQueueId": functionTemplates.removeFromOutput,
  "Exhausted": functionTemplates.mergeElement(EFFECT_TYPE_FILTER),
  "ExpireDelay": functionTemplates.numberValue(),
  "ExpireEffect": singleEffect,
  "Face": {
    merge: singleElement,
    preParse: conditionalParsers.conditionallyParseElement(
      conditionalParsers.outerElementHasName('TooltipAppender'),
      parsers.defaultPreParser,
      functionTemplates.mergeElement("CButton").preParse
    ),
    formatKey: "button",
  },
  "FacingLocation": functionTemplates.removeIfValue("Unknown"),
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
  "Filters": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined("index"),
      elementFormatters.join(
        elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
        elementFormatters.attributeToBoolean(),
      ),
      elementFormatters.join(
        elementFormatters.applyFormatterToAttribute('value', elementFormatters.parseFilterString),
        elementFormatters.defaultElementFormatter
      )
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.elementsAreObjects,
      arrayFormatters.reduceToSingleObject(),
      arrayFormatters.defaultArrayFormatter,
    )
  },
  "FinalEffect": singleEffect,
  "Find": functionTemplates.booleanValue(),
  "Flags": functionTemplates.flags(true),
  "FlagArray": functionTemplates.flags(true),
  "FleeTime": functionTemplates.numberValue(),
  "FleeRange": functionTemplates.numberValue(),
  "FloaterCreation": functionTemplates.removeIfValue("Unknown"),
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
  "HeroSelectCutsceneFile": functionTemplates.removeFromOutput,
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
  "IncreaseEvents": functionTemplates.valueFromAttributeIfOnlyKey('eventId'),
  "IndexArray": functionTemplates.removeFromOutput,
  "InfoFlags": functionTemplates.flags(true),
  "InfoIcon": functionTemplates.singleAsset(),
  "InfoText": functionTemplates.localeText(),
  "InfoTooltipPriority": functionTemplates.numberValue(),
  "InGameUnitStatusCutsceneFile": functionTemplates.removeFromOutput,
  "Init": functionTemplates.numberValue(),
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
  "KillCredit": functionTemplates.removeIfValue("Unknown"),
  "KillCreditUnit": functionTemplates.removeIfValue("Unknown"),
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
  "Launch": functionTemplates.removeFromOutput,
  "LaunchEffect": singleEffect,
  "LauncMissileEffect": singleEffect,
  "LayoutButtons": functionTemplates.removeFromOutput,
  "LeaderAlias": functionTemplates.removeFromOutput,
  "LeaderboardImage": functionTemplates.singleAsset(),
  "Leash": functionTemplates.numberValue(),
  "LeechScoreArray": functionTemplates.removeFromOutput,
  "LegacyOptions": functionTemplates.flags(),
  "Level": functionTemplates.numberValue(),
  "LevelScalingArray": {

  },
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
  "Marker": functionTemplates.singleElementWithReplacement(),
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
  "ModifyScoreArray": functionTemplates.arrayOfNumberValues("Value"),
  "Month": functionTemplates.numberValue(),
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
  "Origin": functionTemplates.removeIfValue("Unknown"),
  "OtherBehavior": functionTemplates.mergeElement(BEHAVIOR_TYPE_FILTER),
  "OtherLocation": functionTemplates.removeIfValue("Unknown"),
  "OtherUnit": functionTemplates.removeIfValue("Unknown"),
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
  "PlacementAround": functionTemplates.removeIfValue("Unknown"),
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
  "Ratio": functionTemplates.numberValue(),
  "RechargeVital": functionTemplates.singleElement,
  "RechargeVitalRate": functionTemplates.numberValue(),
  "RechargeVitalFraction": functionTemplates.numberValue(),
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
  "ReplacementArray": functionTemplates.removeFromOutput,
  "RequireAccess": functionTemplates.booleanValue(),
  "RequireCaster": functionTemplates.removeIfValue("Unknown"),
  "RequireCasterUnit": functionTemplates.removeIfValue("Unknown"),
  "Requirements": functionTemplates.mergeElement(REQUIREMENT_TYPE_FILTER),
  "RequireOriginPlayer": functionTemplates.removeIfValue("Unknown"),
  "RequiredRewardArray": functionTemplates.removeFromOutput,
  "Response": functionTemplates.singleElement,
  "ResponseFlags": functionTemplates.removeFromOutput,
  "ResultFailed": functionTemplates.removeFromOutput,
  "ResultFallback": functionTemplates.removeFromOutput,
  "ResultNoEffect": functionTemplates.removeFromOutput,
  "ResultNoUnit": functionTemplates.removeFromOutput,
  "RevealUnit": functionTemplates.removeIfValue("Unknown"),
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
  "SelectUnit": functionTemplates.removeIfValue("Unknown"),
  "SelfReviveCmd": functionTemplates.singleElement,
  "SeparationRadius": functionTemplates.numberValue(),
  "SearchFilters": functionTemplates.filters(),
  "SearchFlags": functionTemplates.flags(),
  "SearchRadius": functionTemplates.numberValue(),
  "SelectScreenButtonImage": functionTemplates.singleAsset(),
  "SelectTransferUnit": functionTemplates.removeIfValue("Unknown"),
  "SetLastTarget": functionTemplates.removeIfValue("Unknown"),
  "SharedFlags": functionTemplates.flags(),
  "SharedListPersistsForever": functionTemplates.booleanValue(),
  "ShieldRegenDelay": functionTemplates.numberValue(),
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
  "SpawnRange": functionTemplates.numberValue(),
  "SpawnUnit": functionTemplates.mergeElement("CUnit"),
  "Speed": functionTemplates.numberValue(),
  "SpeedMax": functionTemplates.numberValue(),
  "SpeedMultiplierCreep": functionTemplates.numberValue(),
  "SplashHistory": functionTemplates.singleElement,
  "SortName": functionTemplates.localeText(),
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
  "Target": functionTemplates.removeIfValue("Unknown"),
  "TargetCursorInfo": functionTemplates.removeFromOutput,
  "TargetFilters": {
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute("value", elementFormatters.parseFilterString),
      elementFormatters.defaultElementFormatter
    )
  },
  "TargetingHitTestPriority": functionTemplates.removeFromOutput,
  "TargetLocation": functionTemplates.removeIfValue("Unknown"),
  "TargetMessage": functionTemplates.localeText(),
  "TargetSorts": functionTemplates.removeFromOutput,
  "TargetType": functionTemplates.removeFromOutput,
  "TauntDoesntStopUnit": functionTemplates.flags(),
  "TauntDuration": functionTemplates.valuesToSingleObjectOfNumbers(),
  "TeleportEffect": singleEffect,
  "TeleportFlags": functionTemplates.flags(true),
  "TeleportResetRange": functionTemplates.numberValue(),
  "Text": functionTemplates.localeText(),
  "Tier": functionTemplates.numberValue(),
  "TileCutsceneFile": functionTemplates.removeFromOutput,
  "TimeScaleSource": functionTemplates.singleElement,
  "TimestampBehavior": functionTemplates.removeFromOutput,
  "TimeStart": functionTemplates.numberValue(),
  "TimeUse": functionTemplates.numberValue(),
  "Tip": functionTemplates.localeText(),
  "Title": functionTemplates.localeText(),
  "TokenId": functionTemplates.singleElementWithReplacement(),
  "Tooltip": functionTemplates.localeText(),
  "TooltipAddendum": functionTemplates.localeText(),
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
  "VertextArray": functionTemplates.removeFromOutput,
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
  "Weapon": functionTemplates.mergeElement(WEAPON_TYPE_FILTER),
  "WeaponDisableArray": {
    ...functionTemplates.numberValue(),
    formatKey: "disableWeapons",
  },
  "WeaponRange": functionTemplates.numberValue(),
  "WeaponScanBonus": functionTemplates.numberValue(),
  "WhichEffect": singleEffect,
  "WhichLocation": functionTemplates.singleElement,
  "WhichPlayer": functionTemplates.singleElement,
  "WhichUnit": functionTemplates.removeIfValue("Unknown"),
  "WithPlayer": functionTemplates.singleElement,
  "XPFraction": functionTemplates.valuesToSingleObjectOfNumbers(),
  "Year": functionTemplates.numberValue(),
}
