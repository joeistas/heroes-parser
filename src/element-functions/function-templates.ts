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
import { ElementNameFilter } from '../parsers/element-name-filters'

export const removeFromOutput = {
  formatElement: elementFormatters.removeFromOutput,
}

export const singleElement: ElementFunctions = {
  merge: elementMergers.singleElement,
}

export function singleElementWithReplacement(attribute: string = 'value'): ElementFunctions {
  return {
    ...singleElement,
    preParse: parsers.join(
      parsers.defaultPreParser,
      textParsers.attributeValueReplacement(attribute)
    ),
  }
}

export function valueFromAttributeIfOnlyHasKeys(attribute: string = 'value', ...keys: string[]): ElementFunctions {
  return {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.onlyHasKeys(attribute, ...keys),
      elementFormatters.valueFromAttribute(attribute),
      elementFormatters.defaultElementFormatter
    )
  }
}

export function addAttribute(attribute: string, attributeValue: any): ElementFunctions {
  return {
    preParse: parsers.join(
      addParsers.addAttribute(attribute, attributeValue),
      parsers.defaultPreParser
    )
  }
}

export function booleanValue(attribute: string = 'value', trueValue = '1', falseValue = '0'): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    formatElement: elementFormatters.join(
      elementFormatters.attributeToBoolean(attribute, trueValue, falseValue),
      elementFormatters.defaultElementFormatter,
    ),
  }
}

export function numberValue(attribute: string = 'value'): ElementFunctions {
  return {
    merge: elementMergers.singleElement,
    formatElement: elementFormatters.join(
        elementFormatters.attributeToNumber(attribute),
        elementFormatters.defaultElementFormatter,
      )
  }
}

export function removeIfValue(attributeValue: string, attribute: string = "value") {
  return {
    ...singleElement,
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeHasValue(attributeValue, attribute),
      elementFormatters.removeFromOutput,
      elementFormatters.defaultElementFormatter
    )
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

export function valuesToSingleObjectOfNumbers(keyAttribute: string = 'index', valueAttribute: string = 'value'): ElementFunctions {
  return {
    formatElement: elementFormatters.join(
      elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter, keyAttribute),
      elementFormatters.attributeToNumber(valueAttribute),
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
      parsers.defaultPreParser,
      textParsers.attributeValueReplacement(attribute),
      textParsers.replaceWithLocaleText(attribute)
    ),
    formatElement: elementFormatters.join(
      elementFormatters.defaultElementFormatter,
      elementFormatters.conditionallyFormatElement(
        elementFormatters.hasNumberOfKeys(1),
        elementFormatters.valueFromFirstKey,
      )
    ),
  }
}

export function parseTooltip(attribute: string = 'value'): ElementFunctions {
  return {
    ...localeText(attribute),
    preParse: parsers.join(
      localeText(attribute).preParse,
      textParsers.parseTooltip(attribute)
    ),
  }
}

export function renderTooltip(attribute: string = 'value'): ElementFunctions {
  return {
    ...localeText(attribute),
    preParse: parsers.join(
      localeText(attribute).preParse,
      textParsers.parseTooltip(attribute),
      textParsers.renderTooltip(attribute)
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
      parsers.defaultPreParser,
      textParsers.attributeValueReplacement(attribute),
      assetParsers.processAsset(attribute)
    ),
  }
}

export function assets(attribute: string = 'value'): ElementFunctions {
  return {
    preParse: parsers.join(
      parsers.defaultPreParser,
      textParsers.attributeValueReplacement(),
      assetParsers.processAsset()
    ),
  }
}

export function assetArrayToSingleObject(keyAttribute: string = 'index', valueAttribute: string = 'value'): ElementFunctions {
  return {
    ...assets(valueAttribute),
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

export function filters(attribute: string = 'value', index: string = 'index'): ElementFunctions {
  return {
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.attributeIsDefined(index),
      elementFormatters.join(
        elementFormatters.formatAttributeWithKeyFormatter(keyFormatters.defaultKeyFormatter),
        elementFormatters.attributeToBoolean(),
      ),
      elementFormatters.join(
        elementFormatters.applyFormatterToAttribute(attribute, elementFormatters.parseFilterString),
        elementFormatters.defaultElementFormatter
      )
    ),
    formatArray: arrayFormatters.conditionallyFormatArray(
      arrayFormatters.elementsAreObjects,
      arrayFormatters.reduceToSingleObject(),
      arrayFormatters.defaultArrayFormatter,
    )
  }
}

export function mergeElement(elementNameOrFilter: ElementNameFilter | string, attribute: string = 'value') {
  return {
    preParse: parsers.join(
      parsers.defaultPreParser,
      textParsers.attributeValueReplacement(attribute),
      mergeParsers.mergeElement(elementNameOrFilter, attribute)
    ),
    formatElement: elementFormatters.conditionallyFormatElement(
      elementFormatters.onlyHasKeys('value'),
      elementFormatters.removeFromOutput,
      elementFormatters.defaultElementFormatter
    )
  }
}
