export type ElementTypeMap = Map<string, any[]>
export type ElementMap = Map<string, ElementTypeMap>

export function buildElementMap(catalogs: any[]): ElementMap {
  const elementMap: ElementMap = new Map()
  catalogs.forEach(catalog => addCatalogToElementMap(catalog, elementMap))

  return elementMap
}

function addCatalogToElementMap(catalog: any, elementMap: ElementMap): void {
  for(const elementName of Object.keys(catalog)) {
    if(elementName === '$') {
      continue
    }

    const elementTypeMap = elementMap.get(elementName) || new Map()
    if(!elementMap.has(elementName)) {
      elementMap.set(elementName, elementTypeMap)
    }

    for(const element of catalog[elementName]) {
      if(!element.$) {
        continue
      }

      const name = element.$.id ? element.$.id : ''

      if(!elementTypeMap.has(name)) {
        elementTypeMap.set(name, [])
      }

      const elements = elementTypeMap.get(name) || []
      elements.push(element)

      elementTypeMap.set(name, elements)
    }
  }
}
