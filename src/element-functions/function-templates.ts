import { ParseData } from '../parse-data'
import { ElementFunctions } from '../element'
import * as parsers from '../parsers'
import * as addParsers from '../parsers/add-parsers'
import * as assetParsers from '../parsers/asset-parsers'
import * as mergeParsers from '../parsers/merge-parsers'
import * as textParsers from '../parsers/text-parsers'
import * as arrayFormatters from '../formatters/array-formatters'
import * as elementFormatters from '../formatters/element-formatters'
import * as keyFormatters from '../formatters/key-formatters'
import * as elementMergers from '../merge'

export const removeFromOutput = {
  formatElement: elementFormatters.removeFromOutput,
}

export function singleValue(attribute: string = 'value'): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    formatElement: elementFormatters.valueFromAttribute(attribute),
    formatArray: arrayFormatters.firstValue,
  }
}

export function singleBooleanValue(attribute: string = 'value', trueValue = '1', falseValue = '0'): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(attribute),
      elementFormatters.valueToBoolean(trueValue, falseValue),
    ),
    formatArray: arrayFormatters.firstValue,
  }
}

export function singleNumberValue(attribute: string = 'value'): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(attribute),
      elementFormatters.valueToNumber,
    ),
    formatArray: arrayFormatters.firstValue,
  }
}

export function valuesToSingleObject(keyAttribute: string = 'index', valueAttribute: string = 'value'): ElementFunctions {
  return {
    formatElement: elementFormatters.join(
      elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter, keyAttribute),
      elementFormatters.toKeyValuePair(keyAttribute, valueAttribute),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(),
  }
}

export function flags(
  mergeOntoOuterElement: boolean = false,
  keyAttribute: string = 'index',
  valueAttribute: string = 'value'
): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter, keyAttribute),
      elementFormatters.attributeToBoolean(valueAttribute),
      elementFormatters.toKeyValuePair(keyAttribute, valueAttribute),
    ),
    formatArray: arrayFormatters.reduceToSingleObject(mergeOntoOuterElement)
  }
}

export function localeText(attribute: string = 'value'): ElementFunctions {
  return {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(attribute),
      textParsers.replaceWithLocaleText(attribute)),
    formatElement: elementFormatters.valueFromAttribute(attribute),
    formatArray: arrayFormatters.firstValue,
  }
}

export function localeTextRemoveIfEmpty(attribute: string = 'value'): ElementFunctions {
  return {
    ...localeText(attribute),
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(attribute),
      elementFormatters.removeIfEmptyObject,
    ),
  }
}

export function localeTextToSingleObject(keyAttribute: string = 'index', valueAttribute: string = 'value'): ElementFunctions {
  return {
    ...localeText(valueAttribute),
    ...valuesToSingleObject(keyAttribute, valueAttribute),
  }
}


export function singleAsset(attribute: string = 'value'): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      assetParsers.processAsset()
    ),
    formatElement: elementFormatters.valueFromAttribute(attribute),
  }
}

export function assetArray(attribute: string = 'value'): ElementFunctions {
  return {
    preParse: parsers.join(
      textParsers.attributeValueReplacement(),
      assetParsers.processAsset()
    ),
    formatElement: elementFormatters.valueFromAttribute(attribute),
  }
}

export function assetArrayToSingleObject(keyAttribute: string = 'index', valueAttribute: string = 'value'): ElementFunctions {
  return {
    ...assetArray(valueAttribute),
    ...valuesToSingleObject(keyAttribute, valueAttribute),
  }
}

export function arrayOfSingleValues(attribute: string = 'value'): ElementFunctions {
  return {
    formatElement: elementFormatters.valueFromAttribute(attribute),
  }
}

export function arrayOfNumberValues(attribute: string ='value'): ElementFunctions {
  return {
    formatElement: elementFormatters.join(
      elementFormatters.valueFromAttribute(attribute),
      elementFormatters.valueToNumber,
    ),
  }
}
