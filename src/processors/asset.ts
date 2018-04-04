import * as casclib from 'casclib'

import {
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  copyElement,
  ElementProcessor
} from '../element'
import { ParseData } from '../parser'

export type AssetFindCache = Map<string, string[]>

function hasFileExtension(assetValue: string): boolean {
  return assetValue.search(/\..*$/) !== -1
}

function isFullPath(assetValue: string): boolean {
  return assetValue.startsWith("mods/") && hasFileExtension(assetValue)
}

function isValidAsset(assetValue: string): boolean {
  return assetValue && typeof assetValue === 'string' && assetValue != ''
}

function buildAssetSearchPattern(assetValue: string): string {
  return 'mods/heroes.stormmod/*.stormassets/*' + assetValue + (hasFileExtension(assetValue) ? '' : '*')
}

function setAssetValue(element: any, attribute: string, assetValue: string, parseData: ParseData): any {
  element[ELEMENT_ATTRIBUTE_KEY][attribute] = parseData.assetfindCache.get(assetValue)
  return element
}

export function processAsset(attribute: string = 'value'): ElementProcessor {
  return (element: any, containingElement: any, parseData: ParseData): any => {
    const assetValue = getElementAttributes(element)[attribute]
    if(!isValidAsset(assetValue)) {
      return element
    }

    if(isFullPath(assetValue)) {
      element[ELEMENT_ATTRIBUTE_KEY][attribute] = [ assetValue ]
      return element
    }

    if(parseData.assetfindCache.has(assetValue)) {
      return setAssetValue(element, attribute, assetValue, parseData)
    }

    const results = parseData.assets.filter(filePath => !!filePath.match(assetValue))
    parseData.assetfindCache.set(assetValue, results)

    return setAssetValue(element, attribute, assetValue, parseData)
  }
}
