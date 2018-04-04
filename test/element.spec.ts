import { expect } from 'chai'
import { spy } from 'sinon'

import {
  ELEMENT_ATTRIBUTE_KEY,
  getElementFunction,
  getElementAttributes,
  getElementId,
  getElement,
  copyElement,
  mergeAttributes,
  mergeElements,
  mergeWithParent,
  reduceElements,
  parseElement,
} from '../src/element'
import { ElementMap } from '../src//element-map'

describe("getElementFunction", function() {
  const functions = {
    'default': {
      merge: (): any => null,
      process: (): any => null,
    },
    'testElement': {
      merge: (): any => null,
    }
  }

  it("should return the specified function for 'elementName'", function() {
    const func = getElementFunction('testElement', functions, 'merge')
    expect(func).to.equal(functions.testElement.merge)
  })

  it("should return the function in 'default' if it doesn't exist for 'elementName'", function() {
    const func = getElementFunction('testElement', functions, 'process')
    expect(func).to.equal(functions.default.process)
  })
})

describe("getElementAttributes", function() {
  it("should return the element attributes in the ELEMENT_ATTRIBUTE_KEY", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: "thing" } }
    const attributes = getElementAttributes(element)
    expect(attributes).to.eql({ id: 'test', value: "thing" })
  })

  it("should return an empty object if the element has no attributes", function() {
    const attributes = getElementAttributes({})
    expect(attributes).to.be.empty
  })
})

describe("getElementId", function() {
  it("should return 'id' from the element's attributes", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: "thing" } }
    expect(getElementId(element)).to.eql('test')
  })

  it("should return undefined if the element does not have any attributes", function() {
    expect(getElementId({})).to.be.undefined
  })

  it("should return undefined if the element does not have an id", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { value: "thing" } }
    expect(getElementId(element)).to.be.undefined
  })
})

describe("getElement", function() {
  const elementMap = new Map([
    ['CHero', new Map([
      [ 'test', [ {}, {} ] ],
      [ 'test2', [ {} ] ]
    ])]
  ])

  it("should return the list of elements for 'elementId' and 'elementName' in the elementMap", function() {
    const elements = getElement('test', 'CHero', elementMap)
    expect(elements).to.have.lengthOf(2)
  })

  it("should return an empty array if the 'elementName' does not exist in the elementMap", function(){
    const elements = getElement('test', 'testElement', elementMap)
    expect(elements).to.have.lengthOf(0)
  })

  it("should return an empty array if the 'elementId' does not exist for the 'elementName'", function() {
    const elements = getElement('test5', 'CHero', elementMap)
    expect(elements).to.have.lengthOf(0)
  })
})

describe("copyElement", function() {
  const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' }, childElements: [ {}, {} ]}

  it("should a new object equal to the original", function() {
    expect(copyElement(element)).to.eql(element)
  })

  it("should create a new attribute object", function() {
    expect(copyElement(element)[ELEMENT_ATTRIBUTE_KEY]).to.not.equal(element[ELEMENT_ATTRIBUTE_KEY])
  })

  it("should place child elements in new arrays", function() {
    expect(copyElement(element).childElements).to.not.equal(element.childElements)
  })
})

describe("mergeWithParent", function() {
  const parseData: any = {
    elements: new Map([
      ['hero', new Map([
        ['', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {} ] } as any ] ],
        ['test', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' }, testElement2: [ {} ] } as any ] ]
      ])]
    ]) as ElementMap,
    text: new Map(),
    functions: {
      'default': {
        "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
      },
    },
    options: {}
  }

  it("should merge the parent and child attributes", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged[ELEMENT_ATTRIBUTE_KEY]).to.eql({ id: 'test', tier: '1', value: 'thing' })
  })

  it("should override parent attributes with values in the same child attribute", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged[ELEMENT_ATTRIBUTE_KEY]).to.eql({ id: 'test', tier: '1', value: 'thing' })
  })

  it("should return element if element doesn't have an id", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { value: 'thing' }, testElement: [ {} ] }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged).to.equal(element)
  })

  it("should merge the child into the element of the same type in the 'id' in the 'parent' attribute", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', value: 'thing', parent: 'test' }, testElement: [ {} ] }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', tier: '5', value: 'thing', parent: 'test' },
      testElement: [ {},  {} ],
      testElement2: [ {} ],
    })
  })

  it("should merge the child with the element of the same type with an empty 'id' value", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', value: 'thing' }, testElement: [ {} ] }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', tier: '1', value: 'thing' },
      testElement: [ {},  {} ],
    })
  })
})

describe("mergeAttributes", function() {
  it("should return the merged attributes of the two elements", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' } }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' } }

    const merged = mergeAttributes(parent, child, [])
    expect(merged).to.eql({ tier: '1', id: 'test' })
  })

  it("should filter the attributes in 'filters' from the returned attribute object", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' } }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' } }

    const merged = mergeAttributes(parent, child, [ 'id' ])
    expect(merged).to.eql({ tier: '1' })
  })

  it("should override values from parent if they also exist in child", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' } }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' } }

    const merged = mergeAttributes(parent, child, [])
    expect(merged).to.eql({ tier: '2', id: 'test' })
  })
})

describe("reduceElements", function() {
  const parseData: any = {
    elements: new Map(),
    text: new Map(),
    functions: {
      'default': {
        "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
      },
    },
    options: {}
  }

  it("should reduce a list of elements to a single element", function() {
    const elements = [
      { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {} ] },
      { [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' }, testElement2: [ {} ] },
    ]

    const merged = reduceElements(elements, parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' },
      testElement: [ {} ],
      testElement2: [ {} ],
    })
  })
})

describe("mergeElements", function() {
  const parseData: any = {
    elements: new Map(),
    text: new Map(),
    functions: {
      'default': {
        "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
      },
    },
    options: {}
  }

  it("should return an object with the parent and child elements merged", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {}, {} ] }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement2: [ {} ] }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({ [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement: [ {}, {} ], testElement2: [ {} ] })
  })

  it("should merge all inner elements of parent and child using each element types 'merge' function", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {}, {} ] }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement2: [ {} ] }

    const mergeSpy = spy(parseData.functions.default, 'merge')
    mergeElements(parent, child, parseData)
    expect(mergeSpy).to.have.been.calledTwice
  })

  it("should add inner elements that only exist on the parent element", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {}, {} ] }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' } }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({ [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement: [ {}, {} ] })
  })

  it("should add inner elements that only exist on the child element", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' } }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement: [ {}, {} ] }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({ [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement: [ {}, {} ] })
  })

  it("should add inner elements that exists on both the parent and child elements", function() {
    const parent = { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {} ] }
    const child = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement: [ {}, {} ] }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({ [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, testElement: [ {}, {}, {} ] })
  })
})

describe("parseElement", function() {
  beforeEach(function() {
    this.parseData = {
      elements: new Map([
        ['hero', new Map([
          ['', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {} ] } as any ] ],
          ['test', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' }, testElement2: [ {} ] } as any ] ]
        ])]
      ]) as ElementMap,
      text: new Map(),
      functions: {
        'default': {
          "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
        },
        'hero': {
          "process": (element: any): any => element
        },
        'testElement': {
          "process": (element: any): any => element
        },
      },
      options: { xmlSearchPatterns: [] as any[], textSearchPatterns: [] as any[], functions: {}, locales: [] as any[] }
    }
  })

  it("should merge the element with it's parent elements", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(parsedElement).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '1', value: 'thing' },
      testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: {} }, { [ELEMENT_ATTRIBUTE_KEY]: {} } ]
    })
  })

  it("should call the 'process' function on the element", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const processSpy = spy(this.parseData.functions.hero, 'process')
    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.called
  })

  it("should call process on all of the elements inner elements", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const processSpy = spy(this.parseData.functions.testElement, 'process')
    const parsedElement =  parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.calledTwice
  })
})
