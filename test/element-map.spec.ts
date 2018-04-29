import { expect } from 'chai'

import { ELEMENT_ATTRIBUTE_KEY } from "../src/element"
import { buildElementMap, addCatalogToElementMap } from "../src/element-map"

describe("addCatalogToElementMap", function() {
  it("should convert element ids to lowercase in the element map", function() {
    const catalog = {
      CHero: [
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'Thing' } },
      ],
      CTalent: [
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'AnotherThing' } },
      ]
    }

    const elementMap = new Map()
    addCatalogToElementMap(catalog, elementMap)

    const heroes = elementMap.get("CHero")
    expect(heroes).to.have.keys('thing')

    const talents = elementMap.get("CTalent")
    expect(talents).to.have.keys('anotherthing')
  })

  it("should add each element in the catalog to the element map, based on element name and id", function() {
    const catalog = {
      CHero: [
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'thing' } },
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' } },
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'text' } },
      ],
      CTalent: [
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'thing' } },
        { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' } },
      ]
    }

    const elementMap = new Map()
    addCatalogToElementMap(catalog, elementMap)

    expect(elementMap).to.have.all.keys('CHero', 'CTalent')

    expect(elementMap.get('CHero')).to.have.keys('thing', 'test')
    expect(elementMap.get('CHero').get('thing')).to.have.length(1)
    expect(elementMap.get('CHero').get('test')).to.have.length(2)

    expect(elementMap.get('CTalent')).to.have.keys('thing', 'test')
    expect(elementMap.get('CTalent').get('thing')).to.have.length(1)
    expect(elementMap.get('CTalent').get('test')).to.have.length(1)
  })

  it("should add elements without an id under the '' key", function() {
    const catalog = {
      CHero: [
        { [ELEMENT_ATTRIBUTE_KEY]: {} },
      ],
    }

    const elementMap = new Map()
    addCatalogToElementMap(catalog, elementMap)

    expect(elementMap).to.have.all.keys('CHero')
    expect(elementMap.get('CHero')).to.have.keys('')
    expect(elementMap.get('CHero').get('')).to.have.length(1)
  })
})

describe("buildElementMap", function() {
  it("should add the elements in all of the catalogs to the element map", function() {
    const catalogs = [
      {
        CHero: [
          { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' } },
        ],
        CTalent: [
          { [ELEMENT_ATTRIBUTE_KEY]: { id: 'thing' } },
          { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' } },
        ]
      },
      {
        CHero: [
          { [ELEMENT_ATTRIBUTE_KEY]: { id: 'thing' } },
          { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'text' } },
        ],
      }
    ]

    const elementMap = buildElementMap(catalogs)

    expect(elementMap).to.have.all.keys('CHero', 'CTalent')

    expect(elementMap.get('CHero')).to.have.keys('thing', 'test')
    expect(elementMap.get('CHero').get('thing')).to.have.length(1)
    expect(elementMap.get('CHero').get('test')).to.have.length(2)

    expect(elementMap.get('CTalent')).to.have.keys('thing', 'test')
    expect(elementMap.get('CTalent').get('thing')).to.have.length(1)
    expect(elementMap.get('CTalent').get('test')).to.have.length(1)
  })
})
