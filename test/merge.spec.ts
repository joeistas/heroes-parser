import { expect } from 'chai'

import { ELEMENT_ATTRIBUTE_KEY } from "../src/element"
import { defaultMerge, singleElement } from "../src/merge"

describe("defaultMerge", function() {
  it("should concat elements without an index attribute", function() {
    const parentElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          id: "one"
        }
      },
    ]

    const childElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          id: "two"
        }
      },
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          id: "three"
        }
      },
    ]

    const results = defaultMerge(parentElements, childElements, {}, {} as any)
    expect(results).to.have.length(3)
  })

  it("should concat elements with unique index attributes", function() {
    const parentElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "one"
        }
      },
    ]

    const childElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "two"
        }
      },
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "three"
        }
      },
    ]

    const results = defaultMerge(parentElements, childElements, {}, {} as any)
    expect(results).to.have.length(3)
  })

  it("replace parent elments with child elements that have the same index value", function() {
    const parentElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "one",
          value: 'value'
        }
      },
    ]

    const childElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          value: "two"
        }
      },
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "one",
          value: 'test'
        }
      },
    ]

    const results = defaultMerge(parentElements, childElements, {}, {} as any)
    expect(results).to.have.length(2)
    const one = results.find(e => e[ELEMENT_ATTRIBUTE_KEY].index === 'one' )
    expect(one[ELEMENT_ATTRIBUTE_KEY].value).to.eql('test')
  })

  it("should be able to handle elements with an index attribute and without at the same time", function() {
    const parentElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "one",
          value: 'value'
        }
      },
    ]

    const childElements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          value: "two"
        }
      },
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          index: "one",
          value: 'test'
        }
      },
    ]

    const results = defaultMerge(parentElements, childElements, {}, {} as any)
    expect(results).to.have.length(2)
  })
})

it("singleElement should merge parent and child elements into a single element", function() {
  const parseData: any = {
    functions: { default: { merge: defaultMerge }}
  }

  const parentElements = [
    {
      [ELEMENT_ATTRIBUTE_KEY]: {
        index: "one",
        value: 'value',
        test: 'thing'
      }
    },
  ]

  const childElements = [
    {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: "two"
      }
    },
    {
      [ELEMENT_ATTRIBUTE_KEY]: {
        index: "one",
        value: 'test'
      }
    },
  ]

  const results: any = singleElement(parentElements, childElements, {}, parseData)
  expect(results).to.have.length(1)
  expect(results[0][ELEMENT_ATTRIBUTE_KEY].value).to.eql('test')
  expect(results[0][ELEMENT_ATTRIBUTE_KEY].test).to.eql('thing')
})
