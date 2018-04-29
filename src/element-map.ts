import { ELEMENT_ATTRIBUTE_KEY, getElementId } from "./element"

export type ElementTypeMap = Map<string, any[]>
export type ElementMap = Map<string, ElementTypeMap>

export function buildElementMap(catalogs: any[]): ElementMap {
  const elementMap: ElementMap = new Map()
  catalogs.forEach(catalog => addCatalogToElementMap(catalog, elementMap))

  return elementMap
}

export function addCatalogToElementMap(catalog: any, elementMap: ElementMap): void {
  for(const elementName of Object.keys(catalog)) {
    if(elementName === ELEMENT_ATTRIBUTE_KEY) {
      continue
    }

    const elementTypeMap = elementMap.get(elementName) || new Map()
    if(!elementMap.has(elementName)) {
      elementMap.set(elementName, elementTypeMap)
    }

    for(const element of catalog[elementName]) {
      if(!element[ELEMENT_ATTRIBUTE_KEY]) {
        continue
      }

      const id = (getElementId(element) || '').toLowerCase()
      const elements = elementTypeMap.get(id) || []
      elements.push(element)

      elementTypeMap.set(id, elements)
    }
  }
}
