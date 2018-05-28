import {
  ELEMENT_NAME_KEY,
  ELEMENT_ATTRIBUTE_KEY,
  getElementAttributes,
  getElementId,
  getElementName,
  getElementAtPath,
  getValueAtPath,
  getInnerElementKeys,
} from '../element'
import { ParseData } from '../parse-data'
import { ElementNameFilter } from './element-name-filters'
import { ElementParser, ParseContext } from './'
import { attributeValueReplacement } from './text-parsers'
import { ElementMerger } from '../merge'

export const LEVEL_SCALING_ATTRIBUTE = 'levelScaling'

export function levelScalingParser(element: any, outerElement: any, parseData: ParseData, context: ParseContext) {
  if(!element.LevelScalingArray) {
    return element
  }
  const modificationMap: Map<string, Map<string, any>> = new Map()

  element.LevelScalingArray.forEach((levelScaling: any) => {
    if(!levelScaling.Modifications) {
      return
    }

    levelScaling.Modifications.forEach((modification: any) => {
      const entry = getValueAtPath(modification, 'Entry')
      const field = getValueAtPath(modification, 'Field')

      const value = getValueAtPath(modification, 'Value')
      if(!value) {
        return
      }

      const entryMap = modificationMap.get(entry) || new Map()
      entryMap.set(field, modification)
      modificationMap.set(entry, entryMap)
    })
  })

  applyModifications(element, modificationMap)
  delete element.LevelScalingArray

  return element
}

function applyModifications(element: any, modificationMap: Map<string, Map<string, any>>) {
  applyModificationsToElement(element, modificationMap)

  for(const name of getInnerElementKeys(element)) {
    element[name].forEach((innerElement: any) => applyModifications(innerElement, modificationMap))
  }
}

function applyModificationsToElement(element: any, modificationMap: Map<string, Map<string, any>>) {
  const id = getElementId(element)
  if(!id || !modificationMap.has(id)) {
    return
  }

  for(const modification of modificationMap.get(id).values()) {
    const catalog = getValueAtPath(modification, 'Catalog')
    if(!correctCatalog(element, catalog)) {
      return
    }

    const field = getValueAtPath(modification, 'Field')
    const value = getValueAtPath(modification, 'Value')
    if(!value) {
      return
    }

    const elements = getElementAtPath(element, field)
    if(!elements) {
      return
    }

    const attributes = getElementAttributes(elements[0])
    attributes[LEVEL_SCALING_ATTRIBUTE] = value
  }
}

function correctCatalog(element: any, catalog: string): boolean {
  const elementName = getElementName(element)
  return elementName.startsWith('C' + catalog)
}
