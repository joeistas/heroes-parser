import { ELEMENT_ATTRIBUTE_KEY, ElementFunctions } from './element'
import { ParseData } from './parser'
import {
  processAsset,
  mergeElement,
  replaceWithLocaleText,
  addAttribute,
  addInnerElement,
  joinParsers,
  attributeValueReplacement,
  inList,
  startsWith,
} from './element-parsers'
import {
  valueFromAttribute,
  removeFromOutput,
  defaultFormatKey,
  defaultFormatArray,
  joinElementFormatters,
  attributeToBoolean,
  attributeToNumber,
  valueToNumber,
  valueToBoolean,
  reduceToSingleObject,
  elementToKeyValuePair,
  formatAttributeAsKey,
  firstValue,
  pluarlizeKey,
  joinKeyFormatters,
  splitOnCaps,
} from './format'
import { defaultMerge, singleElement } from './merge'

const ABIL_TYPE_FILTER = startsWith("CAbil")
const EFFECT_TYPE_FILTER = startsWith('CEffect')
const BEHAVIOR_TYPE_FILTER = startsWith('CBehavior')
const VALIDATOR_TYPE_FILTER = startsWith("CValidator")
const KINETIC_TYPE_FILTER = startsWith("CKinetic")

export const DEFAULT_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  'default': {
    merge: defaultMerge,
    formatKey: defaultFormatKey,
    formatArray: defaultFormatArray,
  },
  'AbilityModificationArray': {

  },
  'Activity': {

  },
  "AdditionalSearchText": {
    preParse: joinParsers(attributeValueReplacement(), replaceWithLocaleText()),
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "AmmoUnit": {
    preParse: joinParsers(attributeValueReplacement(), mergeElement('CUnit')),
  },
  "AreaArray": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "Around": {
    preParse: mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "AttributeId": {
    formatElement: removeFromOutput,
  },
  "Behavior": {
    preParse: joinParsers(attributeValueReplacement(), mergeElement(BEHAVIOR_TYPE_FILTER)),
  },
  "CaseArray": {
    preParse: joinParsers(
      addInnerElement(VALIDATOR_TYPE_FILTER, 'Validator'),
      addInnerElement(EFFECT_TYPE_FILTER, 'Effect'),
    )
  },
  "CaseDefault": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "CatalogModifications": {

  },
  "CButton": {

  },
  'CmdButtonArray': {
    preParse: mergeElement("CButton", "DefaultButtonFace")
  },
  "CollectionCategory": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "CountEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  'CSkin': {
    preParse: joinParsers(
      // addAttribute("AdditionalSearchText", "Skin/AdditionalSearchText/##id##"),
      // attributeValueReplacement("AdditionalSearchText"),
      // replaceWithLocaleText("AdditionalSearchText"),
      addAttribute("Name", "Skin/Name/##id##"),
      attributeValueReplacement("Name"),
      replaceWithLocaleText("Name"),
      // addAttribute("SortName", "Skin/SortName/##id##"),
      // attributeValueReplacement("SortName"),
      // replaceWithLocaleText("SortName"),
    ),
  },
  "Day": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "Difficulty": {
    formatElement: joinElementFormatters(valueFromAttribute(), splitOnCaps),
    formatArray: firstValue,
  },
  "DisplayModel": {
    formatElement: removeFromOutput,
  },
  "DraftPickCutsceneFile": {
    formatElement: removeFromOutput,
  },
  'Effect': {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  'EffectArray': {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "EventName": {
    merge: singleElement,
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  'Face': {
    preParse: joinParsers(attributeValueReplacement(), mergeElement("CButton")),
  },
  "FeatureArray": {
    formatKey: joinKeyFormatters(defaultFormatKey, pluarlizeKey),
    formatElement: joinElementFormatters(valueFromAttribute(), splitOnCaps),
  },
  'FinalEffect': {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "Flags": {
    formatElement: joinElementFormatters(
      formatAttributeAsKey(defaultFormatKey),
      attributeToBoolean(),
      attributeToNumber(),
      elementToKeyValuePair(),
    ),
    formatArray: reduceToSingleObject(true)
  },
  'HeroAbilArray': {
    preParse: joinParsers(
      attributeValueReplacement('Abil'),
      attributeValueReplacement('Button'),
      mergeElement(ABIL_TYPE_FILTER, 'Abil'),
      addInnerElement('CButton', "Button")
    )
  },
  "HeroSelectCutsceneFile": {
    formatElement: removeFromOutput,
  },
  "HomeScreenCutsceneFile": {
    formatElement: removeFromOutput,
  },
  "HyperlinkId": {
    formatElement: removeFromOutput,
  },
  'Icon': {
    preParse: processAsset()
  },
  "ImpactEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "ImpactLocation": {
    preParse: mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "IncreaseEvents": {
    preParse: mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "InfoIcon": {
    preParse: processAsset(),
  },
  'InfoText': {
    merge: singleElement,
    preParse: joinParsers(attributeValueReplacement(), replaceWithLocaleText()),
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "InGameUnitStatusCutsceneFile": {
    formatElement: removeFromOutput,
  },
  'InitialEffect': {
    preParse: mergeElement(EFFECT_TYPE_FILTER)
  },
  "Kinetic": {
    preParse: mergeElement(KINETIC_TYPE_FILTER),
  },
  "LaunchEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "LaunchLocation": {
    preParse: mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "LevelScalingArray": {

  },
  "LootChestRewardCutsceneFile": {
    formatElement: removeFromOutput,
  },
  "Melee": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "MiniPortraitCutsceneFile": {
    formatElement: removeFromOutput,
  },
  "ModelGroups": {
    formatElement: removeFromOutput,
  },
  "ModelMacroRun": {
    formatElement: removeFromOutput,
  },
  'Modifications': {

  },
  "Month": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "Name": {
    preParse: joinParsers(attributeValueReplacement(), replaceWithLocaleText()),
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "PeriodicEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "PeriodicEffectArray": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  'Portrait': {
    preParse: processAsset(),
  },
  "PrepEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "PreviewCutsceneFile": {
    formatElement: removeFromOutput,
  },
  "ProductId": {
    formatElement: removeFromOutput,
  },
  "Rarity": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "ReleaseDate": {
    merge: singleElement,
    formatElement: joinElementFormatters(
      attributeToNumber('Month'),
      attributeToNumber('Day'),
      attributeToNumber('Year'),
    ),
    formatArray: reduceToSingleObject()
  },
  "ReplacementArray": {
    formatElement: removeFromOutput,
  },
  "RequiredRewardArray": {
    formatElement: removeFromOutput,
  },
  "Role": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "RolesMultiClass": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "RoleScoreValueOverride": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "ScoreScreenCutsceneFile": {
    formatElement: removeFromOutput,
  },
  'SelectScreenButtonImage': {
    merge: singleElement,
    preParse: processAsset(),
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  'SimpleDisplayText': {
    preParse: joinParsers(attributeValueReplacement(), replaceWithLocaleText())
  },
  'SkinArray': {
    preParse: mergeElement('CSkin'),
    formatKey: joinKeyFormatters(defaultFormatKey, pluarlizeKey),
  },
  "SpawnEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "SpawnUnit": {
    preParse: mergeElement('CUnit'),
  },
  'SortName': {
    merge: singleElement,
    preParse: joinParsers(attributeValueReplacement(), replaceWithLocaleText()),
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  'SourceButtonFace': {
    preParse: mergeElement("CButton"),
  },
  'TalentsArray': {

  },
  'TalentTreeArray': {
    preParse: mergeElement("CTalent", 'Talent'),
  },
  "TeleportEffect": {
    preParse: mergeElement(EFFECT_TYPE_FILTER),
  },
  "TileCutsceneFile": {
    formatElement: removeFromOutput,
  },
  "TokenId": {
    preParse: joinParsers(attributeValueReplacement(), mergeElement("CBehaviorTokenCounter")),
  },
  'TooltipVitalName': {
    preParse: replaceWithLocaleText()
  },
  'Unit': {
    preParse: joinParsers(
      attributeValueReplacement(),
      mergeElement("CUnit")
    )
  },
  'Universe': {
    merge: singleElement,
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  'UniverseIcon': {
    merge: singleElement,
    preParse: processAsset(),
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
  "ValidatorArray": {
    preParse: joinParsers(attributeValueReplacement(), mergeElement(VALIDATOR_TYPE_FILTER)),
  },
  'VariationArray': {
    preParse: mergeElement('CSkin'),
    formatKey: joinKeyFormatters(defaultFormatKey, pluarlizeKey),
  },
  'VariationIcon': {
    merge: singleElement,
    preParse: processAsset(),
    formatElement: valueFromAttribute(),
    formatArray: firstValue
  },
  'VOArray': {
    preParse: joinParsers(attributeValueReplacement(), processAsset()),
    formatKey: (key: string) => key,
    formatElement: elementToKeyValuePair(),
    formatArray: reduceToSingleObject(),
  },
  "VODefinition": {
    formatKey: (key: string) => key,
    formatElement: valueFromAttribute(),
  },
  'VoiceLineArray': {
    preParse: attributeValueReplacement(),
    formatKey: joinKeyFormatters(defaultFormatKey, pluarlizeKey),
    formatElement: valueFromAttribute(),
  },
  "WhichLocation": {
    preParse: mergeElement('CUnit'),
  },
  "WhichUnit": {
    preParse: mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "Year": {
    formatElement: valueFromAttribute(),
    formatArray: firstValue,
  },
}
