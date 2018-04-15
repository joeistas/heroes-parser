import * as casclib from 'casclib'

import {
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  copyElement,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementParser } from './'

export type AssetFindCache = Map<string, string[]>

function isValidAsset(assetValue: string): boolean {
  return assetValue && typeof assetValue === 'string' && assetValue != ''
}

function setAssetValue(element: any, attribute: string, assetValue: string, parseData: ParseData): any {
  element[ELEMENT_ATTRIBUTE_KEY][attribute] = parseData.assetfindCache.get(assetValue)
  return element
}

export function processAsset(attribute: string = 'value'): ElementParser {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    let assetValue = getElementAttributes(element)[attribute]
    if(!isValidAsset(assetValue)) {
      return element
    }

    assetValue = assetValue.replace(/\\/g, "/").toLowerCase()
    if(parseData.assetfindCache.has(assetValue)) {
      return setAssetValue(element, attribute, assetValue, parseData)
    }

    const results = parseData.assets.filter(filePath => !!filePath.toLowerCase().match(assetValue))
    parseData.assetfindCache.set(assetValue, results)

    return setAssetValue(element, attribute, assetValue, parseData)
  }
}
