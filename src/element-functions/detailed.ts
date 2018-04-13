import { ELEMENT_ATTRIBUTE_KEY, ElementFunctions, getElementAttributes } from '../element'
import { ParseData } from '../parser'
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

const ABIL_TYPE_FILTER = elementNameFilters.startsWith("CAbil")
const EFFECT_TYPE_FILTER = elementNameFilters.startsWith('CEffect')
const BEHAVIOR_TYPE_FILTER = elementNameFilters.startsWith('CBehavior')
const VALIDATOR_TYPE_FILTER = elementNameFilters.startsWith("CValidator")
const KINETIC_TYPE_FILTER = elementNameFilters.startsWith("CKinetic")

export const DETAILED_FUNCTIONS: { [elementName: string]: ElementFunctions } = {
  'default': {
    merge: defaultMerge,
    formatKey: keyFormatters.defaultKeyFormatter,
    formatArray: arrayFormatters.defaultArrayFormatter,
  },
  'AbilityModificationArray': {

  },
  'Activity': {

  },
  "AcquirePlayer": functionTemplates.singleValue(),
  "AddedThreat": functionTemplates.singleNumberValue(),
  "AdditionalSearchText": functionTemplates.localeText(),
  "AffectedByAbilityPower": functionTemplates.singleBooleanValue(),
  "AffectedByCooldownReduction": functionTemplates.singleBooleanValue(),
  "AffectedByOverdrive": functionTemplates.singleBooleanValue(),
  "AlertName": functionTemplates.localeText(),
  "AlertTooltip": functionTemplates.localeText(),
  "Alignment": functionTemplates.singleValue(),
  "AmmoUnit": {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement('CUnit')),
  },
  "Amount": functionTemplates.singleNumberValue(),
  "AmountScoreArray": {
    preParse: addParsers.addInnerElement('Validator', 'Validator'),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey,
    )
  },
  "AreaArray": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
    formatKey: keyFormatters.join(
      keyFormatters.defaultKeyFormatter,
      keyFormatters.pluralizeKey,
    ),
  },
  "Around": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "AttributeId": functionTemplates.removeFromOutput,
  "Behavior": {
    merge: singleElement,
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement(BEHAVIOR_TYPE_FILTER)),
    formatArray: arrayFormatters.firstValue,
  },
  "BehaviorCategories": functionTemplates.flags(),
  "BehaviorClass": functionTemplates.removeFromOutput,
  "BehaviorFlags": functionTemplates.flags(),
  "BehaviorLink": functionTemplates.singleValue(),
  "BuffFlags": functionTemplates.flags(),
  "CaseArray": {
    preParse: parsers.join(
      addParsers.addInnerElement('Validator', 'Validator'),
      addParsers.addInnerElement('Effect', 'Effect'),
    )
  },
  "CaseDefault": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "Catalog": functionTemplates.singleValue(),
  "CatalogModifications": {

  },
  "CButton": {

  },
  "CEffectSet": {
    formatElement: elementFormatters.valueFromAttribute('effects')
  },
  "Chance": functionTemplates.singleNumberValue(),
  "ChanceArray": {
    formatElement: elementFormatters.join(
      elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
      elementFormatters.attributeToNumber(),
      elementFormatters.toKeyValuePair(),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(),
  },
  'CmdButtonArray': {
    preParse: mergeParsers.mergeElement("CButton", "DefaultButtonFace")
  },
  "CollectionCategory": functionTemplates.singleValue(),
  "CombineArray": {
    // formatElement: elementFormatters.valueFromAttribute(),
    preParse: mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER),
  },
  "Compare": functionTemplates.singleValue(),
  "Count": functionTemplates.singleBooleanValue(),
  "CountEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "CritValidator": {
    preParse: mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER),
  },
  'CSkin': {
    preParse: parsers.join(
      // addParsers.addAttribute("AdditionalSearchText", "Skin/AdditionalSearchText/##id##"),
      // textParsers.attributeValueReplacement("AdditionalSearchText"),
      // textParsers.replaceWithLocaleText("AdditionalSearchText"),
      addParsers.addAttribute("Name", "Skin/Name/##id##"),
      textParsers.attributeValueReplacement("Name"),
      textParsers.replaceWithLocaleText("Name"),
      // addParsers.addAttribute("SortName", "Skin/SortName/##id##"),
      // textParsers.attributeValueReplacement("SortName"),
      // textParsers.replaceWithLocaleText("SortName"),
    ),
  },
  "CTalent": {
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber('tier'),
      elementFormatters.attributeToNumber('column'),
    ),
  },
  "DamageResponse": {
    merge: singleElement,
    formatArray: arrayFormatters.firstValue,
  },
  "Day": functionTemplates.singleNumberValue(),
  "Difficulty": {
    merge: singleElement,
    formatElement: elementFormatters.join(elementFormatters.valueFromAttribute(), elementFormatters.splitOnCaps),
    formatArray: arrayFormatters.firstValue,
  },
  "DisplayModel": functionTemplates.removeFromOutput,
  "DraftPickCutsceneFile": functionTemplates.removeFromOutput,
  "Duration": functionTemplates.singleNumberValue(),
  "DurationBonusMax": functionTemplates.singleNumberValue(),
  "DurationBonusMin": functionTemplates.singleNumberValue(),
  'Effect': {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  'EffectArray': {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "EventName": functionTemplates.singleValue(),
  "ExcludeCasterPlayer": functionTemplates.singleValue(),
  "ExcludeCasterUnit": functionTemplates.singleValue(),
  "ExcludeOriginPlayer": functionTemplates.singleValue(),
  'Face': {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement("CButton")),
    formatKey: (key: string) => 'button',
  },
  "FeatureArray": {
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
    formatElement: elementFormatters.join(elementFormatters.valueFromAttribute(), elementFormatters.splitOnCaps),
  },
  'Field': functionTemplates.singleValue(),
  'FieldIsInteger': functionTemplates.singleBooleanValue(),
  'Filters': {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined('index'),
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
  'FinalEffect': {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "Find": functionTemplates.singleBooleanValue(),
  "Flags": functionTemplates.flags(true),
  'HeroAbilArray': {
    preParse: parsers.join(
      textParsers.attributeValueReplacement('Abil'),
      textParsers.attributeValueReplacement('Button'),
      mergeParsers.mergeElement(ABIL_TYPE_FILTER, 'Abil'),
      addParsers.addInnerElement('CButton', "Button")
    )
  },
  "HeroSelectCutsceneFile": functionTemplates.removeFromOutput,
  "HomeScreenCutsceneFile": functionTemplates.removeFromOutput,
  "Hotkey": {
    preParse: textParsers.attributeValueReplacement(),
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(),
      elementFormatters.removeIfEmptyObject,
    ),
    formatArray: arrayFormatters.firstValue,
  },
  "HotkeyAlias": {
    ...functionTemplates.singleValue(),
    preParse: textParsers.attributeValueReplacement(),
  },
  "HyperlinkId": functionTemplates.removeFromOutput,
  'Icon': functionTemplates.singleAsset(),
  "ImpactEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "ImpactLocation": {
    preParse: addParsers.addInnerElement('Effect', 'Effect'),
    formatArray: arrayFormatters.firstValue
  },
  "IncreaseEvents": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "InfoFlags": functionTemplates.flags(),
  "InfoIcon": functionTemplates.singleAsset(),
  'InfoText': functionTemplates.localeText(),
  "InGameUnitStatusCutsceneFile": functionTemplates.removeFromOutput,
  'InitialEffect': {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "KillCredit": functionTemplates.singleValue(),
  "Kind": {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined('index'),
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
  "LaunchEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "LaunchLocation": {
    merge: singleElement,
    preParse: addParsers.addInnerElement('Effect', 'Effect'),
  },
  "LeechScore": functionTemplates.singleValue(),
  "LevelScalingArray": {

  },
  "LootChestRewardCutsceneFile": functionTemplates.removeFromOutput,
  "MaxCount": functionTemplates.singleNumberValue(),
  "MaxCountError": functionTemplates.singleValue(),
  "MaxStackCount": functionTemplates.singleNumberValue(),
  "Melee": functionTemplates.singleBooleanValue(),
  "MinCountError": functionTemplates.singleValue(),
  "MiniPortraitCutsceneFile": functionTemplates.removeFromOutput,
  "MinStackCountDisplayed": functionTemplates.singleValue(),
  "ModelGroups": functionTemplates.removeFromOutput,
  "ModelMacroRun": functionTemplates.removeFromOutput,
  'Modifications': {
    preParse: (element: any, outerElement: any, parseData: ParseData) => {
      if(!element['Catalog'] || element['Catalog'].length === 0) {
        return element
      }

      const catalog = getElementAttributes(element['Catalog'][0])['value']
      const entry = getElementAttributes(element['Entry'][0])['value']

      if(['Effect', 'Unit', 'Behavior'].includes(catalog)) {
        element[catalog] = [
          {
            [ELEMENT_ATTRIBUTE_KEY]: { value: entry }
          }
        ]
      }

      return element
    },
    formatElement: elementFormatters.join(
      elementFormatters.conditionallyFormatElement(
        elementFormatters.some(
          elementFormatters.attributeHasValue('Actor', 'catalog'),
          elementFormatters.attributeHasValue('Model', 'catalog'),
          elementFormatters.attributeHasValue('Sound', 'catalog'),
        ),
        elementFormatters.removeFromOutput
      ),
      elementFormatters.removeKeyFromElement('catalog'),
      elementFormatters.removeKeyFromElement('entry'),
    )
  },
  "Month": functionTemplates.singleNumberValue(),
  "Name": functionTemplates.localeText(),
  "OffsetFacingFallback": functionTemplates.removeFromOutput,
  "OffsetVectorEndLocation": functionTemplates.removeFromOutput,
  "OffsetVectorStartLocation": functionTemplates.removeFromOutput,
  "OrderArray": functionTemplates.removeFromOutput,
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
  "Player": functionTemplates.singleValue(),
  "Portrait": functionTemplates.singleAsset(),
  "PrepEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "PreviewCutsceneFile": functionTemplates.removeFromOutput,
  "ProductId": functionTemplates.removeFromOutput,
  "Radius": functionTemplates.singleNumberValue(),
  "Range": functionTemplates.singleNumberValue(),
  "Rarity": functionTemplates.singleValue(),
  "RechargeVitalRate": functionTemplates.singleNumberValue(),
  "ReleaseDate": {
    merge: singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.attributeToNumber('Month'),
      elementFormatters.attributeToNumber('Day'),
      elementFormatters.attributeToNumber('Year'),
    ),
    formatArray: arrayFormatters.reduceToSingleObject()
  },
  "RemoveValidatorArray": functionTemplates.arrayOfSingleValues(),
  "ReplacementArray": functionTemplates.removeFromOutput,
  "RequireCasterUnit": functionTemplates.singleValue(),
  "RequireOriginPlayer": functionTemplates.singleValue(),
  "RequireOriginUnit": functionTemplates.singleValue(),
  "RequiredRewardArray": functionTemplates.removeFromOutput,
  "ResponseFlags": functionTemplates.flags(),
  "RevealUnit": functionTemplates.singleValue(),
  "Role": functionTemplates.singleValue(),
  "RolesMultiClass": functionTemplates.singleValue(),
  "RoleScoreValueOverride": functionTemplates.singleValue(),
  "ScoreScreenCutsceneFile": functionTemplates.removeFromOutput,
  "SearchFilters": {
    ...functionTemplates.singleValue(),
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(),
      elementFormatters.parseFilterString,
    ),
  },
  "SearchFlags": functionTemplates.flags(),
  'SelectScreenButtonImage': functionTemplates.singleAsset(),
  'ShowInUI': functionTemplates.singleBooleanValue('value', 'True', 'False'),
  'SimpleDisplayText': functionTemplates.localeText(),
  'SkinArray': {
    preParse: mergeParsers.mergeElement('CSkin'),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  "SpawnEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
  },
  "SpawnUnit": {
    preParse: mergeParsers.mergeElement('CUnit'),
  },
  "splashHistory": functionTemplates.singleValue(),
  'SortName': functionTemplates.localeText(),
  'SourceButtonFace': {
    preParse: mergeParsers.mergeElement("CButton"),
  },
  "TalentAIBuildsArray": {
    formatKey: (key: string) => 'AIBuilds',
    formatElement: elementFormatters.attributeToBoolean('AIOnly'),
  },
  'TalentsArray': functionTemplates.arrayOfSingleValues(),
  'TalentTreeArray': {
    preParse: mergeParsers.mergeElement("CTalent", 'Talent'),
  },
  "TeleportEffect": {
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER),
  },
  "TileCutsceneFile": functionTemplates.removeFromOutput,
  "TimeScaleSource": functionTemplates.singleValue(),
  "TokenId": {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement("CBehaviorTokenCounter")),
  },
  "Tooltip": functionTemplates.localeText(),
  "TooltipAppender": {
    preParse: parsers.join(
      textParsers.replaceWithLocaleText('Text'),
      addParsers.addInnerElement('Validator', 'Validator'),
      addParsers.addInnerElement('CButton', 'Face')
    )
  },
  "TooltipFlags": functionTemplates.flags(),
  'TooltipVitalName': functionTemplates.localeTextToSingleObject(),
  "Trait": functionTemplates.singleBooleanValue(),
  "Type": functionTemplates.singleValue(),
  "UnifiedMoveSpeedFactor": functionTemplates.singleNumberValue(),
  'Unit': {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      mergeParsers.mergeElement("CUnit")
    )
  },
  'Universe': functionTemplates.singleValue(),
  'UniverseIcon': functionTemplates.singleAsset(),
  "UseHotkeyLabel": functionTemplates.singleBooleanValue(),
  "ValidatorArray": {
    preParse: parsers.join(textParsers.attributeValueReplacement(), mergeParsers.mergeElement(VALIDATOR_TYPE_FILTER)),
  },
  "Value": {
    ...functionTemplates.singleValue(),
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(),
      elementFormatters.valueToBoolean(),
      elementFormatters.valueToNumber
    )
  },
  'VariationArray': {
    preParse: mergeParsers.mergeElement('CSkin'),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
  },
  'VariationIcon': functionTemplates.singleAsset(),
  "Visibility": functionTemplates.singleValue(),
  'VOArray': {
    ...functionTemplates.assetArrayToSingleObject(),
    formatKey: (key: string) => key,
  },
  "VODefinition": {
    formatKey: (key: string) => key,
    formatElement: elementFormatters.valueFromAttribute(),
  },
  'VoiceLineArray': {
    preParse: textParsers.attributeValueReplacement(),
    formatKey: keyFormatters.join(keyFormatters.defaultKeyFormatter, keyFormatters.pluralizeKey),
    formatElement: elementFormatters.valueFromAttribute(),
  },
  "WhichLocation": functionTemplates.singleValue(),
  "WhichPlayer": functionTemplates.singleValue(),
  "WhichUnit": {
    merge: singleElement,
    preParse: mergeParsers.mergeElement(EFFECT_TYPE_FILTER, 'Effect'),
    formatElement: elementFormatters.valueFromAttribute(),
    formatArray: arrayFormatters.firstValue,
  },
  "Year": functionTemplates.singleNumberValue(),
}
