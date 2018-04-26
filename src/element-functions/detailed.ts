import { ELEMENT_ATTRIBUTE_KEY, ElementFunctions, getElementAttributes, buildElement, getElement, joinElements } from "../element"
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

export const DETAILED_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  "default": {
    merge: defaultMerge,
    formatKey: keyFormatters.defaultKeyFormatter,
    formatArray: arrayFormatters.defaultArrayFormatter,
  },
  "Abil": functionTemplates.singleValueWithReplacement(),
  "AbilArray": functionTemplates.arrayOfSingleValues("Link"),
  "AbilClass": {
    ...functionTemplates.singleValue(),
    formatElement: elementFormatters.join(
      functionTemplates.singleValue().formatElement,
      elementFormatters.removeFromStart("CAbil")
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
    preParse: textParsers.replaceWithLocaleText("TooltipAddendum"),
  },
  "AbilityStage": functionTemplates.singleValue(),
  "AbilLinkDisableArray": {
    ...functionTemplates.arrayOfSingleValues(),
    formatKey: (key: string) => "disableAbilities"
  },
  "AbilSetId": functionTemplates.removeFromOutput,
  "Acceleration": functionTemplates.singleNumberValue(),
  "AccumulatorArray": {
    preParse: mergeParsers.mergeElement(ACCUMULATOR_TYPE_FILTER)
  },
  "Activity": functionTemplates.removeFromOutput,
  "ActorKey": functionTemplates.removeFromOutput,
  "AcquireFilters": functionTemplates.flags(),
  "AcquireLeashRadius": functionTemplates.singleNumberValue(),
  "AcquirePlayer": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "AcquirePriority": functionTemplates.singleNumberValue(),
  "AcquireTargetSorts": functionTemplates.removeFromOutput,
  "Active": functionTemplates.singleBooleanValue(),
  "AddedThreat": functionTemplates.singleNumberValue(),
  "AdditionalSearchText": functionTemplates.localeText(),
  "AdditiveAttackSpeedFactor": functionTemplates.singleNumberValue(),
  "AdditiveMoveSpeedFactor": functionTemplates.singleNumberValue(),
  "AffectedByAbilityPower": functionTemplates.singleBooleanValue(),
  "AffectedByCooldownReduction": functionTemplates.singleBooleanValue(),
  "AffectedByOverdrive": functionTemplates.singleBooleanValue(),
  "AIBaseThreat": functionTemplates.removeFromOutput,
  "AIEvalFactor": functionTemplates.removeFromOutput,
  "AIHealthThresholds": functionTemplates.removeFromOutput,
  "AIThinkTree": functionTemplates.removeFromOutput,
  "AIUtility": functionTemplates.removeFromOutput,
  "AlertName": functionTemplates.localeText(),
  "AlertTooltip": functionTemplates.localeText(),
  "Alignment": functionTemplates.removeFromOutput,
  "AlliedPushPriority": functionTemplates.singleNumberValue(),
  "AlternateNameSearchText": functionTemplates.localeText(),
  "AlternateUnitArray": {
    preParse: mergeParsers.mergeElement("CUnit")
  },
  "AmmoOwner": functionTemplates.singleValue(),
  "AmmoUnit": {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement("CUnit")),
  },
  "ArmorMitigationTable": {
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.allHaveAttribute("index"),
      arrayFormatters.combineBy("index")
    )
  },
  "Amount": functionTemplates.singleNumberValue(),
  "AmountScoreArray": functionTemplates.removeFromOutput,
  "ApplicationRule": functionTemplates.singleValue(),
  "Arc": functionTemplates.singleNumberValue(),
  "ArcSlop": functionTemplates.singleNumberValue(),
  "AreaArray": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey,
    ),
  },
  "ArmorModification": {
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("allArmorBonus"),
      elementFormatters.attributeToNumber("stackCount"),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "ArmorSet": {
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.allHaveAttribute("index"),
      arrayFormatters.combineBy("index")
    ),
  },
  "Around": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
  },
  "AtMaxEvents": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
    formatElement: elementFormatters.valueFromAttribute("EventId"),
  },
  "AtMinEvents": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
    formatElement: elementFormatters.valueFromAttribute("EventId"),
  },
  "AttackTargetPriority": functionTemplates.singleNumberValue(),
  "AttributeFactor": {
    ...functionTemplates.valuesToSingleObjectOfNumbers(),
    formatKey: 'factors'
  },
  "AttributeId": functionTemplates.removeFromOutput,
  "Attributes": functionTemplates.flags(true),
  "AutoCastAcquireLevel": functionTemplates.singleValue(),
  "AutoCastFilters": functionTemplates.filters(),
  "AutoQueueArray": functionTemplates.flags(),
  "Backswing": functionTemplates.singleNumberValue(),
  "Behavior": {
    merge: singleElement,
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      mergeParsers.mergeElement(BEHAVIOR_TYPE_FILTER)
    ),
    formatArray: arrayFormatters.firstValue,
  },
  "BehaviorArray": {
    preParse: mergeParsers.mergeElement(BEHAVIOR_TYPE_FILTER),
    formatElement: elementFormatters.valueFromAttribute("Link"),
  },
  "BehaviorCategories": {
    ...functionTemplates.flags(),
    formatKey: "categories",
  },
  "BehaviorClass": functionTemplates.removeFromOutput,
  "BehaviorFlags": functionTemplates.flags(true),
  "BehaviorLink": functionTemplates.singleValueWithReplacement(),
  "BehaviorLinkDisableArray": {
    ...functionTemplates.arrayOfSingleValues(),
    formatKey: (key: string) => "disableBehaviors",
  },
  "BehaviorState": functionTemplates.singleValue(),
  "Birth": functionTemplates.removeFromOutput,
  "BuffFlags": functionTemplates.flags(true),
  "CAccumulatorTimed": {
    preParse: addParsers.addAttribute('accumulator', 'timed')
  },
  "CanBeSuppressed": functionTemplates.flags(),
  "CancelableArray": functionTemplates.flags(),
  "CardLayouts": functionTemplates.removeFromOutput,
  "CargoSize": functionTemplates.singleNumberValue(),
  "CaseArray": {
    preParse: parsers.join(
      addParsers.addInnerElement("Validator", "Validator"),
      addParsers.addInnerElement("Effect", "Effect"),
    ),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey
    ),
  },
  "CaseDefault": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: "default",
  },
  "CastIntroTime": functionTemplates.singleNumberValue(),
  "CastOutroTimeEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "Catalog": functionTemplates.singleValue(),
  "CatalogModifications": {
    preParse: parsers.join(
      addParsers.addInnerElement("Operation", "Operation"),
      addParsers.addInnerElement("Reference", "Reference")
    ),
    formatKey: 'modifications',
  },
  "Categories": functionTemplates.flags(),
  "CBehaviorBuff": {
    preParse: addParsers.addAttribute("type", "buff")
  },
  "CBehaviorClickResponse": functionTemplates.removeFromOutput,
  "CBehaviorCreepSource": functionTemplates.removeFromOutput,
  "CBehaviorHeroPlaystyle": functionTemplates.removeFromOutput,
  "CBehaviorTrail": functionTemplates.removeFromOutput,
  "CBehaviorUnitTracker": functionTemplates.removeFromOutput,
  "CBehaviorThreat": functionTemplates.removeFromOutput,
  "CBehaviorTimeStamp": functionTemplates.removeFromOutput,
  "CEffectAbortMissle": {
    preParse: addParsers.addAttribute('effectType', 'abortMissle')
  },
  "CEffectApplyForce": {
    preParse: addParsers.addAttribute('effectType', 'applyForce')
  },
  "CEffectCancelOrder": {
    preParse: addParsers.addAttribute('effectType', 'cancelOrder')
  },
  "CEffectDamage": {
    preParse: addParsers.addAttribute('effectType', 'damage')
  },
  "CEffectDestroyPersistent": {
    preParse: addParsers.addAttribute('effectType', 'destroyEffect')
  },
  "CEffectIssueOrder": {
    preParse: addParsers.addAttribute('effectType', 'issueOrder')
  },
  "CEffectLaunchMissle": {
    preParse: addParsers.addAttribute('effectType', 'launchMissle')
  },
  "CEffectLaunchMissleAdvanced": {
    preParse: addParsers.addAttribute('effectType', 'launchMissle')
  },
  "CEffectModifyBehaviorBuffDuration": {
    preParse: addParsers.addAttribute('effectType', 'modifyDuration')
  },
  "CEffectRemoveBehavior": {
    preParse: addParsers.addAttribute('effectType', 'removeBehavior')
  },
  "CEffectRemoveKinetic": {
    preParse: addParsers.addAttribute('effectType', 'removeBehavior')
  },
  "CEffectSet": {
    formatElement: elementFormatters.valueFromAttribute("effects")
  },
  "CEffectAddTrackedUnit": {
    preParse: addParsers.addAttribute('effectType', 'addTrackedUnit')
  },
  "CEffectClearTrackedUnits": {
    preParse: addParsers.addAttribute('effectType', 'clearTrackedUnits')
  },
  "CEffectRemoveTrackedUnit": {
    preParse: addParsers.addAttribute('effectType', 'removeTrackedUnit')
  },
  "CEffectUseMagazine": functionTemplates.removeFromOutput,
  "Chance": functionTemplates.singleNumberValue(),
  "ChanceArray": {
    formatElement: elementFormatters.join(
      elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
      elementFormatters.attributeToNumber(),
      elementFormatters.toKeyValuePair(),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "Change": functionTemplates.singleNumberValue(),
  "ChangeFraction": functionTemplates.singleNumberValue(),
  "Charge": {
    preParse: textParsers.attributeValueReplacement("Link"),
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "ChargeLink": functionTemplates.singleValue(),
  "CItemAbil": {
    preParse: mergeParsers.mergeElementFromInnerElementValue(ABIL_TYPE_FILTER, "Abil")
  },
  "Class": functionTemplates.removeFromOutput,
  "CmdButtonArray": {
    preParse: parsers.join(
      mergeParsers.mergeElement("CButton", "DefaultButtonFace"),
      addParsers.addInnerElement("Requirements", "Requirements")
    ),
    formatArray: arrayFormatters.combineBy('index'),
  },
  "CollationId": {
    preParse: textParsers.attributeValueReplacement()
  },
  "CollectionCategory": functionTemplates.singleValue(),
  "CollectionIcon": functionTemplates.singleAsset(),
  "Collide": functionTemplates.flags(),
  "Column": functionTemplates.singleNumberValue(),
  "CombineArray": {
    preParse: mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER),
    formatKey: (key: string) => "validators"
  },
  "CombinedVital": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "CombinedVitalCompare": {
    ...functionTemplates.singleValue(),
    formatElement: elementFormatters.join(
      functionTemplates.singleValue().formatElement,
      elementFormatters.formatCompareOperator,
    )
  },
  "Compare": {
    ...functionTemplates.singleValue(),
    formatElement: elementFormatters.join(
      functionTemplates.singleValue().formatElement,
      elementFormatters.formatCompareOperator,
    )
  },
  "ConditionalEvents": {
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("CompareValue"),
      elementFormatters.applyFormatterToAttribute("Compare", elementFormatters.formatCompareOperator)
    ),
  },
  "ConjoinedFlags": functionTemplates.flags(true),
  "ContextUnit": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "Cooldown": {
    preParse: textParsers.attributeValueReplacement("Link"),
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("timeStart"),
      elementFormatters.attributeToNumber("timeUse")
    ),
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "CooldownLink": functionTemplates.singleValue(),
  "Copy": functionTemplates.singleBooleanValue(),
  "Cost": {
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "Count": functionTemplates.singleBooleanValue(),
  "CountMax": functionTemplates.singleNumberValue(),
  "CountStart": functionTemplates.singleNumberValue(),
  "CountUse": functionTemplates.singleNumberValue(),
  "CountEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "CreateFlags": functionTemplates.flags(),
  "CRequirementAnd": {
    preParse: addParsers.addAttribute('operator', "and")
  },
  "CRequirementCountAbil": {
    preParse: addParsers.addAttribute('operator', "countAbility")
  },
  "CRequirementCountBehavior": {
    preParse: addParsers.addAttribute('operator', "countBehavior")
  },
  "CRequirementCountUnit": {
    preParse: addParsers.addAttribute('operator', "countUnit")
  },
  "CRequirementCountUpgrade": {
    preParse: addParsers.addAttribute('operator', "countUpgrade")
  },
  "CRequirementDiv": {
    preParse: addParsers.addAttribute('operator', "divide")
  },
  "CRequirementEq": {
    preParse: addParsers.addAttribute('operator', "==")
  },
  "CRequirementGT": {
    preParse: addParsers.addAttribute('operator', ">")
  },
  "CRequirementGTE": {
    preParse: addParsers.addAttribute('operator', ">=")
  },
  "CRequirementLT": {
    preParse: addParsers.addAttribute('operator', "<")
  },
  "CRequirementLTE": {
    preParse: addParsers.addAttribute('operator', "<=")
  },
  "CRequirementMod": {
    preParse: addParsers.addAttribute('operator', "modulus")
  },
  "CRequirementMul": {
    preParse: addParsers.addAttribute('operator', "multiply")
  },
  "CRequirementNE": {
    preParse: addParsers.addAttribute('operator', "!=")
  },
  "CRequirementNot": {
    preParse: addParsers.addAttribute('operator', "not")
  },
  "CRequirementOdd": {
    preParse: addParsers.addAttribute('operator', "odd")
  },
  "CRequirementOr": {
    preParse: addParsers.addAttribute('operator', "or")
  },
  "CRequirementSum": {
    preParse: addParsers.addAttribute('operator', "sum")
  },
  "CRequirementXor": {
    preParse: addParsers.addAttribute('operator', "xor")
  },
  "CritStep": functionTemplates.singleNumberValue(),
  "CritValidator": {
    preParse: mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER),
  },
  "CSkin": {
    // preParse: parsers.join(
    //   // addParsers.addAttribute("AdditionalSearchText", "Skin/AdditionalSearchText/##id##"),
    //   // textParsers.attributeValueReplacement("AdditionalSearchText"),
    //   // textParsers.replaceWithLocaleText("AdditionalSearchText"),
    //   addParsers.addAttribute("Name", "Skin/Name/##id##"),
    //   textParsers.attributeValueReplacement("Name"),
    //   textParsers.replaceWithLocaleText("Name"),
    //   // addParsers.addAttribute("SortName", "Skin/SortName/##id##"),
    //   // textParsers.attributeValueReplacement("SortName"),
    //   // textParsers.replaceWithLocaleText("SortName"),
    // ),
  },
  "CTalent": {
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("tier"),
      elementFormatters.attributeToNumber("column"),
    ),
  },
  "CursorRangeMode": functionTemplates.singleValue(),
  "CValidatorIsUnitTracked": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.tracked = formattedElement.find
      delete formattedElement.find
      return formattedElement
    }
  },
  "CValidatorPlayerAI": functionTemplates.removeFromOutput,
  "CValidatorPlayerTalent": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.talent = formattedElement.value
      formattedElement.hasTalent = !!formattedElement.find

      delete formattedElement.find
      delete formattedElement.value

      return formattedElement
    }
  },
  "CValidatorUnitArmorLevel": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'armorAmount'
      return formattedElement
    }
  },
  "CValidatorUnitCompareDamageTakenTime": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'damageTakenTime'
      return formattedElement
    }
  },
  "CValidatorUnitCompareField": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'compareField'
      return formattedElement
    }
  },
  "CValidatorUnitCompareKillCount": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'hasKills'
      return formattedElement
    }
  },
  "CValidatorUnitCompareMarkerCount": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'markerCount'
      return formattedElement
    }
  },
  "CValidatorUnitCompareOrderCount": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'orderCount'
      return formattedElement
    }
  },
  "CValidatorUnitCompareSpeed": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'speed'
      return formattedElement
    }
  },
  "CValidatorUnitCompareTargetRange": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'targetRange'
      return formattedElement
    }
  },
  "CValidatorUnitCompareVital": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'vital'
      return formattedElement
    }
  },
  "CValidatorUnitCompareVitality": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.validates = 'vital'
      return formattedElement
    }
  },
  "CValidatorUnitCompareWeaponLegacyState": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.state = formattedElement.value
      delete formattedElement.value
      return formattedElement
    }
  },
  "CValidatorUnitIsHero": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.isHero = true

      return formattedElement
    },
  },
  "CValidatorUnitMover": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.unitType = formattedElement.value
      formattedElement.movesUnit = !!formattedElement.find

      delete formattedElement.find
      delete formattedElement.value

      return formattedElement
    }
  },
  "CValidatorUnitOrder": functionTemplates.removeFromOutput,
  "CValidatorUnitOrderQueue": functionTemplates.removeFromOutput,
  "CValidatorUnitOrderTargetType": functionTemplates.removeFromOutput,
  "CValidatorUnitTimeElapsed": functionTemplates.removeFromOutput,
  "CValidatorUnitType": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.unit = formattedElement.value
      formattedElement.isUnit = !!formattedElement.find

      delete formattedElement.find
      delete formattedElement.value

      return formattedElement
    }
  },
  "CValidatorUnitWeaponCanTargetUnit": {
    formatElement: (formattedElement: any, element: any) => {
      formattedElement.canTarget = true

      return formattedElement
    },
  },
  "DamageDealtAdditiveMultiplier": functionTemplates.valuesToSingleObjectOfNumbers(),
  "DamageDealtFraction": functionTemplates.valuesToSingleObjectOfNumbers(),
  "DamageDealtScaled": functionTemplates.valuesToSingleObjectOfNumbers(),
  "DamageDealtXP": functionTemplates.singleBooleanValue(),
  "DamageModifierSource": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "DamagePoint": functionTemplates.singleNumberValue(),
  "DamageResponse": {
    merge: singleElement,
    preParse: parsers.join(
      addParsers.addInnerElement("Handled", "Handled"),
      addParsers.addInnerElement("Exhausted", "Exhausted")
    ),
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("modifyLimit"),
      elementFormatters.attributeToNumber("modifyFraction"),
      elementFormatters.attributeToNumber("modifyMinimumDamage"),
      elementFormatters.attributeToNumber("priority"),
      elementFormatters.attributeToNumber("clampMinimum"),
      elementFormatters.attributeToBoolean("fatal"),
      elementFormatters.attributeToBoolean("suppressFloatersCausedByBehavior"),
      elementFormatters.applyFormatterToAttribute("targetFilters", elementFormatters.parseFilterString),
    ),
    formatArray: arrayFormatters.firstValue,
  },
  "DamageTakenXP": functionTemplates.singleBooleanValue(),
  "Day": functionTemplates.singleNumberValue(),
  "DeathRevealDuration": functionTemplates.removeFromOutput,
  "DeathRevealFilters": functionTemplates.removeFromOutput,
  "DeathRevealRadius": functionTemplates.removeFromOutput,
  "DeathRevealType": functionTemplates.removeFromOutput,
  "DeathTime": functionTemplates.singleNumberValue(),
  "DeathType": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "DeathUnloadEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER)
  },
  "DecreaseEvents": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
    formatElement: elementFormatters.valueFromAttribute("EventId"),
  },
  "DefaultAcquireLevel": functionTemplates.removeFromOutput,
  "DefaultError": functionTemplates.removeFromOutput,
  "Delay": functionTemplates.singleNumberValue(),
  "DelayMax": functionTemplates.singleNumberValue(),
  "DelayMin": functionTemplates.singleNumberValue(),
  "Description": functionTemplates.localeText(),
  "DestructionFunction": functionTemplates.removeFromOutput,
  "Detected": functionTemplates.singleBooleanValue(),
  "Difficulty": {
    merge: singleElement,
    formatElement: elementFormatters.join(elementFormatters.valueFromAttribute(), elementFormatters.splitOnCaps),
    formatArray: arrayFormatters.firstValue,
  },
  "DisableValidatorArray": {
    ...functionTemplates.arrayOfSingleValues(),
    formatKey: (key: string) => "disableValidators"
  },
  "DisplayDuration": functionTemplates.flags(),
  "DisplayEffect": {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      mergeParsers.mergeElement(EFFECT_TYPE_FILTER)
    ),
  },
  "DisplayModel": functionTemplates.removeFromOutput,
  "DistanceMax": functionTemplates.singleNumberValue(),
  "DistanceMin": functionTemplates.singleNumberValue(),
  "DraftCutsceneFile": functionTemplates.removeFromOutput,
  "DraftPickCutsceneFile": functionTemplates.removeFromOutput,
  "DraftScreenLargeImage": functionTemplates.singleAsset(),
  "DraftScreenLargeImageBackground": functionTemplates.singleAsset(),
  "DraftScreenPortrait": functionTemplates.singleAsset(),
  "DraftScreenPortraitBackground": functionTemplates.singleAsset(),
  "Duration": functionTemplates.singleNumberValue(),
  "DurationBonusMax": functionTemplates.singleNumberValue(),
  "DurationBonusMin": functionTemplates.singleNumberValue(),
  "EditorCategories": functionTemplates.removeFromOutput,
  "EditorFlags": functionTemplates.removeFromOutput,
  "Effect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "EffectArray": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "EffectCategory": functionTemplates.flags(),
  "EffectHistoryLimit": functionTemplates.valuesToSingleObjectOfNumbers(),
  "EffectRange": {
    ...functionTemplates.singleValue(),
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
    )
  },
  "Enabled": functionTemplates.singleBooleanValue(),
  "EndOfMatchCutsceneFile": functionTemplates.removeFromOutput,
  "EnergyMax": functionTemplates.singleNumberValue(),
  "EnergyStart": functionTemplates.singleNumberValue(),
  "EnergyRegenRate": functionTemplates.singleNumberValue(),
  "Entry": functionTemplates.singleValue(),
  "ErrorAlert": functionTemplates.removeFromOutput,
  "Event": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
    formatElement: elementFormatters.valueFromAttribute("EventId"),
  },
  "EventName": functionTemplates.singleValue(),
  "ExcludeCasterUnit": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "ExcludeOriginPlayer": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "ExecuteUnitAutoQueueId": functionTemplates.removeFromOutput,
  "Exhausted": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "ExpireDelay": functionTemplates.singleNumberValue(),
  "ExpireEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "Face": {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement("CButton")),
    formatKey: (key: string) => "button",
  },
  "FacingLocation": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "FeatureArray": {
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
    formatElement: elementFormatters.join(elementFormatters.valueFromAttribute(), elementFormatters.splitOnCaps),
  },
  "Fidget": functionTemplates.removeFromOutput,
  "Field": functionTemplates.singleValue(),
  "FieldIsInteger": functionTemplates.singleBooleanValue(),
  "Filters": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined("index"),
      elementFormatters.join(
        elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
        elementFormatters.attributeToBoolean(),
        elementFormatters.toKeyValuePair(),
      ),
      elementFormatters.join(
        elementFormatters.valueFromAttribute(),
        elementFormatters.parseFilterString,
      )
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.elementsAreObjects,
      arrayFormatters.reduceToSingleObject(),
      arrayFormatters.lastValue,
    )
  },
  "FinalEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "Find": functionTemplates.singleBooleanValue(),
  "Flags": functionTemplates.flags(true),
  "FlagArray": functionTemplates.flags(true),
  "FleeTime": functionTemplates.singleNumberValue(),
  "FleeRange": functionTemplates.singleNumberValue(),
  "FloaterCreation": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "FollowRange": functionTemplates.singleNumberValue(),
  "Fraction": {
    merge: singleElement,
    formatArray: arrayFormatters.firstValue,
  },
  "Gender": functionTemplates.singleValue(),
  "Grown": functionTemplates.removeFromOutput,
  "Handled": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "HasShield": functionTemplates.singleBooleanValue(),
  "HealDealtAdditiveMultiplier": functionTemplates.valuesToSingleObjectOfNumbers(),
  "Height": functionTemplates.singleNumberValue(),
  "HeroAbilArray": {
    preParse: parsers.join(
      textParsers.attributeValueReplacement("Abil"),
      textParsers.attributeValueReplacement("Button"),
      mergeParsers.mergeElement(ABIL_TYPE_FILTER, "Abil"),
      addParsers.addInnerElement("Button", "Face")
    )
  },
  "HeroArray": {
    preParse: mergeParsers.mergeElement("CHero")
  },
  "HeroPlaystyleFlags": functionTemplates.flags(),
  "HeroSelectCutsceneFile": functionTemplates.removeFromOutput,
  "HomeScreenCutsceneFile": functionTemplates.removeFromOutput,
  "HitMask": functionTemplates.flags(),
  "HitsChangedEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "Hotkey": functionTemplates.removeFromOutput,
  "HotkeyAlias": functionTemplates.removeFromOutput,
  "HyperlinkId": functionTemplates.removeFromOutput,
  "Icon": functionTemplates.singleAsset(),
  "IgnoreRange": functionTemplates.singleNumberValue(),
  "ImageFacing": functionTemplates.singleValue(),
  "ImpactEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "ImpactFilters": functionTemplates.flags(),
  "ImpactLocation": {
    merge: singleElement,
    preParse: addParsers.addInnerElement("Effect", "Effect"),
    formatArray: arrayFormatters.firstValue
  },
  "ImpactUnit": {
    merge: singleElement,
    preParse: addParsers.addInnerElement("Effect", "Effect"),
    formatArray: arrayFormatters.firstValue
  },
  "IncreaseEvents": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
    formatElement: elementFormatters.valueFromAttribute("EventId"),
  },
  "InfoArray": {
    formatElement: elementFormatters.attributeToNumber("Distance"),
    formatArray: arrayFormatters.combineBy('index')
  },
  "InfoFlags": functionTemplates.flags(true),
  "InfoIcon": functionTemplates.singleAsset(),
  "InfoText": functionTemplates.localeText(),
  "InfoTooltipPriority": functionTemplates.singleNumberValue(),
  "InGameUnitStatusCutsceneFile": functionTemplates.removeFromOutput,
  "InitialEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "InitializerFunction": functionTemplates.removeFromOutput,
  "InnerRadius": functionTemplates.singleNumberValue(),
  "InnerRadiusSafetyMultiplier": functionTemplates.singleNumberValue(),
  "InterruptArray": functionTemplates.flags(),
  "InterruptCost": {
    merge: singleElement,
    formatArray: arrayFormatters.firstValue
  },
  "KillCredit": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "KillCreditUnit": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "Kind": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined("index"),
      elementFormatters.join(
        elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
        elementFormatters.attributeToNumber(),
        elementFormatters.toKeyValuePair(),
      ),
      elementFormatters.valueFromAttribute()
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.elementsAreObjects,
      arrayFormatters.reduceToSingleObject(),
      arrayFormatters.lastValue,
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
  "KindSplash": functionTemplates.singleValue(),
  "Kinetic": {
    preParse: mergeParsers.mergeElement(KINETIC_TYPE_FILTER),
  },
  "LastAttackTargetUnit": {
    merge: singleElement,
    preParse: addParsers.addInnerElement("Effect", "Effect"),
    formatArray: arrayFormatters.firstValue,
  },
  "LateralAcceleration": functionTemplates.singleNumberValue(),
  "Launch": functionTemplates.removeFromOutput,
  "LaunchEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "LaunchLocation": {
    merge: singleElement,
    preParse: addParsers.addInnerElement("Effect", "Effect"),
    formatArray: arrayFormatters.firstValue,
  },
  "LauncMissileEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "LaunchUnit": {
    merge: singleElement,
    preParse: addParsers.addInnerElement("Effect", "Effect"),
    formatArray: arrayFormatters.firstValue,
  },
  "LayoutButtons": functionTemplates.removeFromOutput,
  "LeaderAlias": functionTemplates.removeFromOutput,
  "LeaderboardImage": functionTemplates.singleAsset(),
  "Leash": functionTemplates.singleNumberValue(),
  "LeechScoreArray": functionTemplates.removeFromOutput,
  "LegacyOptions": functionTemplates.flags(),
  "LevelScalingArray": {

  },
  "LifeMax": functionTemplates.singleNumberValue(),
  "LifeRegenMax": functionTemplates.singleNumberValue(),
  "LifeRegenRate": functionTemplates.singleNumberValue(),
  "LifeStart": functionTemplates.singleNumberValue(),
  "LineDashType": functionTemplates.singleValue(),
  "LoadCargoEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER)
  },
  "LoadingScreenImage": functionTemplates.singleAsset(),
  "LoadTransportBehavior": {
    preParse: mergeParsers.mergeElement(BEHAVIOR_TYPE_FILTER)
  },
  "Location": functionTemplates.singleValue(),
  "LoiterInnerRadius": functionTemplates.singleNumberValue(),
  "LoiterRadius": functionTemplates.singleNumberValue(),
  "LootChestRewardCutsceneFile": functionTemplates.removeFromOutput,
  "Marker": functionTemplates.singleValueWithReplacement(),
  "Mass": functionTemplates.singleNumberValue(),
  "Max": functionTemplates.singleNumberValue(),
  "MaxAccumulation": functionTemplates.singleNumberValue(),
  "MaxAttackSpeedMultiplier": functionTemplates.singleNumberValue(),
  "MaxCargoCount": functionTemplates.singleNumberValue(),
  "MaxCargoSize": functionTemplates.singleNumberValue(),
  "MaxCount": functionTemplates.singleNumberValue(),
  "MaxCountError": functionTemplates.singleValue(),
  "MaxStackCount": functionTemplates.singleNumberValue(),
  "MaxStepCount": functionTemplates.singleNumberValue(),
  "MaxUnloadRange": functionTemplates.singleNumberValue(),
  "Melee": functionTemplates.singleBooleanValue(),
  "MinAccumulation": functionTemplates.singleNumberValue(),
  "MinAttackSpeedMultiplier": functionTemplates.singleNumberValue(),
  "MinCountError": functionTemplates.removeFromOutput,
  "MinDistanceRadiusMultiplier": functionTemplates.singleNumberValue(),
  "MiniPortraitCutsceneFile": functionTemplates.removeFromOutput,
  "MinimapRadius": functionTemplates.singleNumberValue(),
  "MinimumRange": functionTemplates.singleNumberValue(),
  "MinPatrolDistance": functionTemplates.singleNumberValue(),
  "MinScanRange": functionTemplates.singleNumberValue(),
  "MinStackCountDisplayed": functionTemplates.singleValue(),
  "Missing": functionTemplates.singleBooleanValue(),
  "Model": functionTemplates.removeFromOutput,
  "ModelGroups": functionTemplates.removeFromOutput,
  "ModelMacroRun": functionTemplates.removeFromOutput,
  "Modification": {
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("pushPriority"),
      elementFormatters.attributeToNumber("alliedPushPriority"),
      elementFormatters.attributeToNumber("radar"),
      elementFormatters.attributeToNumber("killXPBonus"),
      elementFormatters.attributeToNumber("detect"),
      elementFormatters.attributeToNumber("unifiedMoveSpeedFactor"),
      elementFormatters.attributeToNumber("moveSpeedBonus"),
      elementFormatters.attributeToNumber("accelerationBonus"),
      elementFormatters.attributeToBoolean("updateAttackSpeedEachFrame"),
      elementFormatters.applyFormatterToAttribute("detectFilters", elementFormatters.parseFilterString),
      elementFormatters.applyFormatterToAttribute("radarFilters", elementFormatters.parseFilterString),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(true),
  },
  "ModificationType": functionTemplates.singleValue(),
  // "Modifications": {
  //   preParse: (element: any, outerElement: any, parseData: ParseData) => {
  //     if(!element["Catalog"] || element["Catalog"].length === 0) {
  //       return element
  //     }
  //
  //     const catalog = getElementAttributes(element["Catalog"][0])["value"]
  //     const entry = getElementAttributes(element["Entry"][0])["value"]
  //
  //     if(["Effect", "Unit", "Behavior"].includes(catalog)) {
  //       element[catalog] = [
  //         {
  //           [ELEMENT_ATTRIBUTE_KEY]: { value: entry }
  //         }
  //       ]
  //     }
  //
  //     return element
  //   },
  //   formatElement: elementFormatters.join(
  //     elementFormatters.conditionallyFormatElement(
  //       elementFormatters.some(
  //         elementFormatters.attributeHasValue("Actor", "catalog"),
  //         elementFormatters.attributeHasValue("Model", "catalog"),
  //         elementFormatters.attributeHasValue("Sound", "catalog"),
  //         elementFormatters.attributeHasValue("Game", "catalog"),
  //       ),
  //       elementFormatters.removeFromOutput
  //     ),
  //     elementFormatters.removeKeyFromElement("catalog"),
  //     elementFormatters.removeKeyFromElement("entry"),
  //   )
  // },
  "ModifyFlags": functionTemplates.flags(true),
  "ModifyLimitVitalMaxFractionArray": functionTemplates.valuesToSingleObjectOfNumbers(),
  "ModifyOwnerPlayer": {
    merge: singleElement,
    preParse: addParsers.addInnerElement("Effect", "Effect"),
    formatArray: arrayFormatters.firstValue,
  },
  "ModifyScoreArray": functionTemplates.arrayOfNumberValues("Value"),
  "Month": functionTemplates.singleNumberValue(),
  "Mover": functionTemplates.singleValue(),
  "MoveFilters": functionTemplates.filters(),
  "MoveSpeedBonus": functionTemplates.singleNumberValue(),
  "MultiplierPerStep": functionTemplates.singleNumberValue(),
  "Name": functionTemplates.localeText(),
  "Negate": functionTemplates.singleBooleanValue(),
  "NodeArray": {
    preParse: mergeParsers.mergeElement(REQUIREMENT_TYPE_FILTER, 'Link'),
    formatArray: arrayFormatters.combineBy('index'),
  },
  "OccludeHeight": functionTemplates.singleNumberValue(),
  "OffCost": {
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  "OffsetFacingFallback": functionTemplates.removeFromOutput,
  "Offsets": functionTemplates.removeFromOutput,
  "OffsetVectorEndLocation": functionTemplates.removeFromOutput,
  "OffsetVectorStartLocation": functionTemplates.removeFromOutput,
  "OperandArray": {
    preParse: mergeParsers.mergeElement(REQUIREMENT_TYPE_FILTER)
  },
  "Operation": functionTemplates.singleValue(),
  "Options": functionTemplates.flags(),
  "OrderArray": functionTemplates.removeFromOutput,
  "Origin": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "OtherBehavior": {
    preParse: mergeParsers.mergeElement(BEHAVIOR_TYPE_FILTER),
  },
  "OtherLocation": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "OtherUnit": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "OverlapIndex": functionTemplates.singleValue(),
  "ParentAbil": functionTemplates.singleValue(),
  "PartyFrameImage": functionTemplates.singleAsset(),
  "PartyPanelButtonImage": functionTemplates.singleAsset(),
  "PauseableArray": functionTemplates.flags(),
  "Period": functionTemplates.singleNumberValue(),
  "PeriodCount": functionTemplates.singleNumberValue(),
  "PeriodicEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "PeriodicEffectArray": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey)
  },
  "PeriodicPeriod": functionTemplates.singleNumberValue(),
  "PeriodicPeriodArray": functionTemplates.arrayOfNumberValues(),
  "PeriodicOffsetArray": functionTemplates.removeFromOutput,
  "PeriodMax": functionTemplates.singleNumberValue(),
  "PeriodMin": functionTemplates.singleNumberValue(),
  "Placeholder": functionTemplates.removeFromOutput,
  "PlacementArc": functionTemplates.singleNumberValue(),
  "PlacementAround": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "PlacementRange": functionTemplates.singleNumberValue(),
  "Plane": functionTemplates.removeFromOutput,
  "PlaneArray": functionTemplates.removeFromOutput,
  "PlaneDelta": functionTemplates.removeFromOutput,
  "Player": functionTemplates.singleValueRemoveIfValue('Unknown'),
  "Portrait": functionTemplates.singleAsset(),
  "PreemptableArray": functionTemplates.flags(),
  "PrepEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "PreswingBeforeAttack": functionTemplates.singleNumberValue(),
  "PreswingBetweenAttacks": functionTemplates.singleNumberValue(),
  "PreviewCutsceneFile": functionTemplates.removeFromOutput,
  "ProductId": functionTemplates.removeFromOutput,
  "ProgressionLootChestReward": functionTemplates.removeFromOutput,
  "ProjectionDistanceScale": functionTemplates.singleNumberValue(),
  "ProjectionMultiplier": functionTemplates.singleNumberValue(),
  "ProjectionSourceValue": functionTemplates.singleValue(),
  "ProjectionTargetValue": functionTemplates.singleValue(),
  "ProvideCategories": functionTemplates.flags(),
  "PurchaseWarningCondition": functionTemplates.removeFromOutput,
  "PushPriority": functionTemplates.singleNumberValue(),
  "Radius": functionTemplates.singleNumberValue(),
  "RandomDelayMax": functionTemplates.singleNumberValue(),
  "RandomDelayMin": functionTemplates.singleNumberValue(),
  "Range": functionTemplates.singleNumberValue(),
  "RangeSlop": functionTemplates.singleNumberValue(),
  "RankArray": {
    preParse: parsers.join(
      addParsers.addInnerElement("Face", "Face"),
      mergeParsers.mergeElement(ITEM_TYPE_FILTER, "Item")
    )
  },
  "Rarity": functionTemplates.singleValue(),
  "Ratings": {
    merge: singleElement,
    formatArray: arrayFormatters.firstValue,
  },
  "Ratio": functionTemplates.singleNumberValue(),
  "RechargeVital": functionTemplates.singleValue(),
  "RechargeVitalRate": functionTemplates.singleNumberValue(),
  "RechargeVitalFraction": functionTemplates.singleNumberValue(),
  "RefreshEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER)
  },
  "RefundArray": functionTemplates.flags(),
  "RefundFraction": {
    merge: singleElement,
    formatArray: arrayFormatters.firstValue,
  },
  "Relationship": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined('index'),
      elementFormatters.join(
        elementFormatters.attributeToBoolean(),
        elementFormatters.toKeyValuePair(),
      ),
      elementFormatters.valueFromAttribute()
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.allHaveAttribute("index"),
      arrayFormatters.combineBy("index"),
      arrayFormatters.lastValue
    )
  },
  "ReleaseDate": {
    merge: singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber("Month"),
      elementFormatters.attributeToNumber("Day"),
      elementFormatters.attributeToNumber("Year"),
    ),
    formatArray: arrayFormatters.reduceToSingleObject()
  },
  "RemoveValidatorArray": {
    ...functionTemplates.arrayOfSingleValues(),
    formatKey: "removeValidators"
  },
  "ReplacementArray": functionTemplates.removeFromOutput,
  "RequireCaster": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "RequireCasterUnit": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "Requirements": {
    preParse: mergeParsers.mergeElement(REQUIREMENT_TYPE_FILTER)
  },
  "RequireOriginPlayer": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "RequiredRewardArray": functionTemplates.removeFromOutput,
  "Response": functionTemplates.singleValue(),
  "ResponseFlags": functionTemplates.removeFromOutput,
  "ResultFailed": functionTemplates.removeFromOutput,
  "ResultFallback": functionTemplates.removeFromOutput,
  "ResultNoEffect": functionTemplates.removeFromOutput,
  "ResultNoUnit": functionTemplates.removeFromOutput,
  "RevealUnit": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "ReviveInfoBase": functionTemplates.removeFromOutput,
  "ReviveType": functionTemplates.singleValueWithReplacement(),
  "Role": functionTemplates.singleValue(),
  "RolesMultiClass": functionTemplates.singleValue(),
  "RoleScoreValueOverride": functionTemplates.singleValue(),
  "Row": functionTemplates.singleNumberValue(),
  "Scale": functionTemplates.singleNumberValue(),
  "ScoreResult": functionTemplates.singleValue(),
  "ScoreScreenCutsceneFile": functionTemplates.removeFromOutput,
  "ScoreScreenImage": functionTemplates.singleAsset(),
  "SelectAlias": functionTemplates.removeFromOutput,
  "SelectUnit": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "SelfReviveCmd": functionTemplates.singleValue(),
  "SeparationRadius": functionTemplates.singleNumberValue(),
  "SearchFilters": functionTemplates.filters(),
  "SearchFlags": functionTemplates.flags(),
  "SearchRadius": functionTemplates.singleNumberValue(),
  "SelectScreenButtonImage": functionTemplates.singleAsset(),
  "SelectTransferUnit": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "SetLastTarget": functionTemplates.singleValueRemoveIfValue("Unknown"),
  "SharedListPersistsForever": functionTemplates.singleBooleanValue(),
  "ShieldRegenDelay": functionTemplates.singleNumberValue(),
  "ShowInUI": functionTemplates.singleBooleanValue("value", "True", "False"),
  "ShowProgressArray": functionTemplates.flags(),
  "Sight": functionTemplates.singleNumberValue(),
  "SightMaximum": functionTemplates.singleNumberValue(),
  "SimpleDisplayText": functionTemplates.localeText(),
  "SkinArray": {
    preParse: mergeParsers.mergeElement("CSkin"),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "SmartFilters": functionTemplates.filters(),
  "SmartPriority": functionTemplates.singleNumberValue(),
  "SmartValidatorArray": {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER)
    ),
  },
  "SpawnCount": functionTemplates.singleNumberValue(),
  "SpawnEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, "Effect"),
  },
  "SpawnRange": functionTemplates.singleNumberValue(),
  "SpawnUnit": {
    preParse: mergeParsers.mergeElement("CUnit"),
  },
  "Speed": functionTemplates.singleNumberValue(),
  "SpeedMax": functionTemplates.singleNumberValue(),
  "SpeedMultiplierCreep": functionTemplates.singleNumberValue(),
  "SplashHistory": functionTemplates.singleValue(),
  "SortName": functionTemplates.localeText(),
  "Source": {
    merge: singleElement,
    formatArray: arrayFormatters.firstValue
  },
  "SourceButtonFace": {
    preParse: mergeParsers.mergeElement("CButton"),
  },
  "SourceEffect": functionTemplates.singleValue(),
  "Start": functionTemplates.removeFromOutput,
  "State": functionTemplates.singleValue(),
  "StateFlags": functionTemplates.flags(),
  "StationaryTurningRate": functionTemplates.singleNumberValue(),
  "StepDistance": functionTemplates.singleNumberValue(),
  "StepLoops": functionTemplates.singleNumberValue(),
  "SubgroupAlias": functionTemplates.removeFromOutput,
  "SubgroupPriority": functionTemplates.singleNumberValue(),
  "SucceedIfBehaviorLacksDuration": functionTemplates.singleBooleanValue(),
  "SucceedIfUnitLacksBehavior": functionTemplates.singleBooleanValue(),
  "SupportedFilters": functionTemplates.filters(),
  "TacticalAIFilters": functionTemplates.filters(),
  "TalentAIBuildsArray": {
    formatKey: (key: string) => "AIBuilds",
    formatElement: elementFormatters.attributeToBoolean("AIOnly"),
  },
  "TalentsArray": functionTemplates.arrayOfSingleValues(),
  "TalentTreeArray": {
    preParse: mergeParsers.mergeElement("CTalent", "Talent"),
  },
  "Target": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "TargetCursorInfo": functionTemplates.removeFromOutput,
  "TargetFilters": {
    ...functionTemplates.valuesToSingleObject(),
    formatElement: elementFormatters.join(
      elementFormatters.applyFormatterToAttribute("value", elementFormatters.parseFilterString),
      functionTemplates.valuesToSingleObject().formatElement
    )
  },
  "TargetingHitTestPriority": functionTemplates.removeFromOutput,
  "TargetLocation": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "TargetMessage": functionTemplates.localeText(),
  "TargetSorts": functionTemplates.removeFromOutput,
  "TargetType": functionTemplates.removeFromOutput,
  "TauntDoesntStopUnit": functionTemplates.flags(),
  "TauntDuration": functionTemplates.valuesToSingleObjectOfNumbers(),
  "TeleportEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "TeleportFlags": functionTemplates.flags(true),
  "TeleportResetRange": functionTemplates.singleNumberValue(),
  "TileCutsceneFile": functionTemplates.removeFromOutput,
  "TimeScaleSource": functionTemplates.singleValue(),
  "TimestampBehavior": functionTemplates.removeFromOutput,
  "TimeUse": functionTemplates.singleNumberValue(),
  "Tip": functionTemplates.localeText(),
  "Title": functionTemplates.localeText(),
  "TokenId": {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement("CBehaviorTokenCounter")),
  },
  "Tooltip": functionTemplates.localeText(),
  "TooltipAppender": {
    preParse: parsers.join(
      textParsers.replaceWithLocaleText("Text"),
      addParsers.addInnerElement("Validator", "Validator"),
      addParsers.addInnerElement("Face", "Face")
    )
  },
  "TooltipFlags": functionTemplates.flags(),
  "TooltipVitalName": functionTemplates.localeTextToSingleObject(),
  "TotalCargoSpace": functionTemplates.singleNumberValue(),
  "TrackedUnit": {
    merge: singleElement,
    preParse: parsers.join(
      addParsers.addInnerElement('Effect', "Effect"),
      addParsers.addInnerElement('Value', "Value"),
    ),
    formatArray: arrayFormatters.firstValue,
  },
  "TrackedUnitFilters": functionTemplates.filters(),
  "TrackerUnit": functionTemplates.singleValue(),
  "TrackingBehavior": {
    preParse: mergeParsers.mergeElement(BEHAVIOR_TYPE_FILTER)
  },
  "Trait": functionTemplates.singleBooleanValue(),
  "TurnAngle": functionTemplates.singleNumberValue(),
  "TurningRate": functionTemplates.singleNumberValue(),
  "Type": functionTemplates.singleValue(),
  "TypeFallbackUnit": functionTemplates.singleValue(),
  "Types": functionTemplates.flags(),
  "UnifiedMoveSpeedFactor": functionTemplates.singleNumberValue(),
  "Unit": {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      conditionalParsers.conditionallyParseElement(
        conditionalParsers.outerElementHasName('CValidatorLocationPlacement'),
        conditionalParsers.passThrough,
        mergeParsers.mergeElement("CUnit")
      )
    )
  },
  "UninterruptibleArray": functionTemplates.flags(),
  "UnitDamageType": functionTemplates.singleValue(),
  "Universe": functionTemplates.singleValue(),
  "UniverseIcon": functionTemplates.singleAsset(),
  "UnloadCargoEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER)
  },
  "UnloadPeriod": functionTemplates.singleNumberValue(),
  "UseHotkeyLabel": functionTemplates.removeFromOutput,
  "UseMarkerArray": functionTemplates.flags(),
  "UseSharedList": functionTemplates.singleBooleanValue(),
  "UsesLineDash": functionTemplates.singleBooleanValue(),
  "ValidatedArray": functionTemplates.flags(),
  "ValidatorArray": {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER)
    ),
  },
  "Value": {
    ...functionTemplates.singleValueIfOnlyAttribute(),
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber(),
      functionTemplates.singleValueIfOnlyAttribute().formatElement
    ),
  },
  "VariationArray": {
    preParse: mergeParsers.mergeElement("CSkin"),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "VariationIcon": functionTemplates.singleAsset(),
  "VeterancyLevelArray": {
    formatElement: elementFormatters.attributeToNumber("minVeterancyXP"),
  },
  "Visibility": functionTemplates.singleValue(),
  "Vital": functionTemplates.valuesToSingleObject(),
  "VitalArray": {
    formatArray: arrayFormatters.combineBy("index"),
    formatKey: "vitals"
  },
  "VitalMaxArray": {
    ...functionTemplates.valuesToSingleObjectOfNumbers(),
    formatKey: "vitalMaxModification"
  },
  "VitalMaxIncreaseAffectsCurrentArray": functionTemplates.flags(),
  "VOArray": {
    ...functionTemplates.assetArrayToSingleObject(),
    formatKey: (key: string) => "voiceOver",
  },
  "VODefinition": {
    ...functionTemplates.singleValueWithReplacement(),
    formatKey: (key: string) => key,
  },
  "VoiceLineArray": {
    preParse: textParsers.attributeValueReplacement(),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
    formatElement: elementFormatters.valueFromAttribute(),
  },
  "Weapon": {
    preParse: mergeParsers.mergeElement(WEAPON_TYPE_FILTER)
  },
  "WhichEffect": {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      mergeParsers.mergeElement(EFFECT_TYPE_FILTER)
    ),
  },
  "WhichLocation": functionTemplates.singleValue(),
  "WhichPlayer": functionTemplates.singleValue(),
  "WhichUnit": functionTemplates.singleValueAddEffectRemoveIfUnknown,
  "WithPlayer": functionTemplates.singleValue(),
  "XPFraction": functionTemplates.valuesToSingleObjectOfNumbers(),
  "Year": functionTemplates.singleNumberValue(),
}
