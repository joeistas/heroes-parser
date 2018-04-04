import { ELEMENT_ATTRIBUTE_KEY, ElementFunctions } from './element'
import { ParseData } from './parser'
import {
  processAsset,
  replaceElement,
  processText,
  addAttribute,
  addInnerElement,
  joinProcessors,
  replaceText,
  inList,
  startsWith,
} from './processors'

const ABIL_TYPE_FILTER = startsWith("CAbil")
const EFFECT_TYPE_FILTER = startsWith('CEffect')
const BEHAVIOR_TYPE_FILTER = startsWith('CBehavior')
const VALIDATOR_TYPE_FILTER = startsWith("CValidator")
const KINETIC_TYPE_FILTER = startsWith("CKinetic")

export const DEFAULT_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  'default': {
    merge: function(parentElements: any[], childElements: any[], mergedAttributes: any): any[] {
      const elements = [ ...parentElements, ...childElements ]
      const indexedElements = elements.filter(e => e[ELEMENT_ATTRIBUTE_KEY] && !!e[ELEMENT_ATTRIBUTE_KEY].index)
      const unindexed = elements.filter(e => !e[ELEMENT_ATTRIBUTE_KEY] || !e[ELEMENT_ATTRIBUTE_KEY].index)

      return unindexed.concat([ ...new Map(indexedElements.map(e => [e[ELEMENT_ATTRIBUTE_KEY].index, e]) as [string, any][]).values() ])
    },
  },
  'TalentTreeArray': {
    process: replaceElement("CTalent", 'Talent')
  },
  'TalentsArray': {

  },
  'SelectScreenButtonImage': {
    process: processAsset(),
  },
  'UniverseIcon': {
    process: processAsset(),
  },
  'VariationIcon': {
    process: processAsset(),
  },
  'SkinArray': {
    process: replaceElement('CSkin')
  },
  'VariationArray': {
    process: replaceElement('CSkin')
  },
  'SortName': {
    process: processText()
  },
  'InfoText': {
    process: processText()
  },
  "InfoIcon": {
    process: processAsset(),
  },
  'CSkin': {
    process: joinProcessors(
      addAttribute("AdditionalSearchText", "Skin/AdditionalSearchText/##id##"),
      addAttribute("Name", "Skin/Name/##id##"),
      addAttribute("SortName", "Skin/SortName/##id##"),
      replaceText("AdditionalSearchText", "Name", "SortName"),
      processText("AdditionalSearchText"),
      processText("Name"),
      processText("SortName"),
    )
  },
  'VOArray': {
    process: joinProcessors(replaceText("value"), processAsset()),
  },
  'VoiceLineArray': {
    process: joinProcessors(replaceText("value"), processAsset()),
  },
  'Portrait': {
    process: processAsset(),
  },
  "LevelScalingArray": {

  },
  'AbilityModificationArray': {

  },
  "CatalogModifications": {

  },
  'Modifications': {

  },
  'HeroAbilArray': {
    process: joinProcessors(
      replaceText('Abil', 'Button'),
      replaceElement(ABIL_TYPE_FILTER, 'Abil'),
      addInnerElement('CButton', "Button")
    )
  },
  'Unit': {
    process: joinProcessors(
      replaceText('value'),
      replaceElement("CUnit")
    )
  },
  'Face': {
    process: joinProcessors(replaceText('value'), replaceElement("CButton")),
  },
  'SourceButtonFace': {
    process: replaceElement("CButton"),
  },
  'Icon': {
    process: processAsset()
  },
  'TooltipVitalName': {
    process: processText()
  },
  'SimpleDisplayText': {
    process: joinProcessors(replaceText("value"), processText())
  },
  'CmdButtonArray': {
    process: replaceElement("CButton", "DefaultButtonFace")
  },
  'Effect': {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  'InitialEffect': {
    process: replaceElement(EFFECT_TYPE_FILTER)
  },
  'FinalEffect': {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "PeriodicEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  'EffectArray': {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "PeriodicEffectArray": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "AreaArray": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  'Activity': {

  },
  "PrepEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "Behavior": {
    process: joinProcessors(replaceText('value'), replaceElement(BEHAVIOR_TYPE_FILTER)),
  },
  "WhichUnit": {
    process: replaceElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "ValidatorArray": {
    process: joinProcessors(replaceText('value'), replaceElement(VALIDATOR_TYPE_FILTER)),
  },
  "TokenId": {
    process: joinProcessors(replaceText('value'), replaceElement("CBehaviorTokenCounter")),
  },
  "CaseArray": {
    process: joinProcessors(
      addInnerElement(VALIDATOR_TYPE_FILTER, 'Validator'),
      addInnerElement(EFFECT_TYPE_FILTER, 'Effect'),
    )
  },
  "CaseDefault": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "TeleportEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "ImpactLocation": {
    process: replaceElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "ImpactEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "LaunchLocation": {
    process: replaceElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "LaunchEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  },
  "SpawnEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "SpawnUnit": {
    process: replaceElement('CUnit'),
  },
  "WhichLocation": {
    process: replaceElement('CUnit'),
  },
  "AmmoUnit": {
    process: joinProcessors(replaceText('value'), replaceElement('CUnit')),
  },
  "Kinetic": {
    process: replaceElement(KINETIC_TYPE_FILTER),
  },
  "Around": {
    process: replaceElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "IncreaseEvents": {
    process: replaceElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "CountEffect": {
    process: replaceElement(EFFECT_TYPE_FILTER),
  }
}
