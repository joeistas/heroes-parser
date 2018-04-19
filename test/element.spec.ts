import { expect } from 'chai'
import { spy } from 'sinon'

import {
  ELEMENT_ATTRIBUTE_KEY,
  ELEMENT_NAME_KEY,
  getElementFunction,
  getElementAttributes,
  getElementId,
  getElementName,
  getElement,
  findElementNameForId,
  copyElement,
  mergeAttributes,
  mergeElements,
  joinElements,
  mergeWithParent,
  reduceElements,
} from '../src/element'
import { ElementMap } from '../src/element-map'

describe("getElementFunction", function() {
  const functions = {
    'default': {
      merge: (): any => null,
      preParse: (): any => null,
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
    const func = getElementFunction('testElement', functions, 'preParse')
    expect(func).to.equal(functions.default.preParse)
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

it("getElementName should return the value in $elementName", function() {
  const element = { [ELEMENT_NAME_KEY]: 'thing' }
  expect(getElementName(element)).to.equal('thing')
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

describe("findElementNameForId", function() {
  const elementMap = new Map([
    ['CHero', new Map([
      [ 'test', [ {}, {} ] ],
      [ 'test2', [ {} ] ]
    ])],
    ['CSkin', new Map([
      [ 'test3', [ {}, {} ] ],
      [ 'test4', [ {} ] ]
    ])]
  ])

  it("should find the elementName that has the elementId in the ElementMap", function() {
    expect(findElementNameForId(['CHero', 'CSkin'], 'test3', elementMap)).to.equal('CSkin')
  })
  it("should return undefined if the elementId is not found in elementNames", function() {
    expect(findElementNameForId(['CHero', 'CSkin'], 'element', elementMap)).to.be.undefined
  })
})

describe("copyElement", function() {
  const element = {
    [ELEMENT_ATTRIBUTE_KEY]: { id: 'test' },
    [ELEMENT_NAME_KEY]: 'testName',
    childElements: [ {}, {} ],
  }

  it("should a new object equal to the original", function() {
    expect(copyElement(element)).to.eql(element)
  })

  it("should create a new attribute object", function() {
    expect(copyElement(element)[ELEMENT_ATTRIBUTE_KEY]).to.not.equal(element[ELEMENT_ATTRIBUTE_KEY])
  })

  it("should place child elements in new arrays", function() {
    expect(copyElement(element).childElements).to.not.equal(element.childElements)
  })

  it("should set the element's name", function() {
    expect(copyElement(element)).to.have.property(ELEMENT_NAME_KEY).that.is.eql('testName')
  })
})

describe("mergeWithParent", function() {
  const parseData: any = {
    elements: new Map([
      ['hero', new Map([
        [
          '',
          [
            {
              [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
              testElement: [ {} ]
            } as any
          ]
        ],
        [
          'test',
          [
            {
              [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' },
              testElement2: [ {} ]
            } as any
          ]
        ]
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
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', value: 'thing', parent: 'test' },
      [ELEMENT_NAME_KEY]: 'hero',
      testElement: [ {} ]
    }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', tier: '5', value: 'thing' },
      [ELEMENT_NAME_KEY]: 'hero',
      testElement: [ {},  {} ],
      testElement2: [ {} ],
    })
  })

  it("should merge the child with the element of the same type with an empty 'id' value", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', value: 'thing' },
      [ELEMENT_NAME_KEY]: 'hero',
      testElement: [ {} ]
    }

    const merged = mergeWithParent(element, 'hero', parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', tier: '1', value: 'thing' },
      [ELEMENT_NAME_KEY]: 'hero',
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
      { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, [ELEMENT_NAME_KEY]: 'test', testElement: [ {} ] },
      { [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' }, [ELEMENT_NAME_KEY]: 'test', testElement2: [ {} ] },
    ]

    const merged = reduceElements(elements, parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' },
      [ELEMENT_NAME_KEY]: 'test',
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
    const parent = {
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {} ]
    }
    const child = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement2: [ {} ]
    }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({ [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, [ELEMENT_NAME_KEY]: 'test', testElement: [ {}, {} ], testElement2: [ {} ] })
  })

  it("should merge all inner elements of parent and child using each element types 'merge' function", function() {
    const parent = {
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {} ]
    }
    const child = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement2: [ {} ]
    }

    const mergeSpy = spy(parseData.functions.default, 'merge')
    mergeElements(parent, child, parseData)
    expect(mergeSpy).to.have.been.calledTwice
  })

  it("should add inner elements that only exist on the parent element", function() {
    const parent = {
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {} ]
    }
    const child = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
    }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({ [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' }, [ELEMENT_NAME_KEY]: 'test', testElement: [ {}, {} ] })
  })

  it("should add inner elements that only exist on the child element", function() {
    const parent = {
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
      [ELEMENT_NAME_KEY]: 'test',
    }
    const child = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {} ],
    }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {} ],
    })
  })

  it("should add inner elements that exists on both the parent and child elements", function() {
    const parent = {
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {} ],
    }
    const child = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {} ],
    }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '2' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {}, {}, {} ]
    })
  })

  it("should set the elementName to the child's elementName", function() {
    const parent = {
      [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' },
      [ELEMENT_NAME_KEY]: 'test',
      testElement: [ {} ],
    }

    const child = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'element', value: 'thing' },
      [ELEMENT_NAME_KEY]: 'hero',
      testElement: [ {} ]
    }

    const merged = mergeElements(parent, child, parseData)
    expect(merged).to.have.property(ELEMENT_NAME_KEY).that.is.equal('hero')
  })
})

describe("joinElements", function() {
  it("should set the element name on the joined element if at least one of the elements has one", function() {
    const elements = [
      {},
      {
        [ELEMENT_NAME_KEY]: 'hero'
      },
      {}
    ]

    const joined = joinElements(elements)
    expect(joined).to.have.property(ELEMENT_NAME_KEY).that.equals('hero')
  })

  it("should not set the elemet name if no elements has an element name", function() {
    const elements = [ {}, {} ]

    const joined = joinElements(elements)
    expect(joined).to.not.have.property(ELEMENT_NAME_KEY)
  })

  it("should merge the attributes of all of the elements", function() {
    const elements = [
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          id: 'thing',
          value: 'test',
        }
      },
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          effect: 'anEffect',
        }
      },
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          value: 'override',
        }
      },
    ]

    const joined = joinElements(elements)
    expect(joined[ELEMENT_ATTRIBUTE_KEY]).to.eql({
      id: 'thing',
      effect: 'anEffect',
      value: 'override',
    })
  })

  it("should concat the arrays for all inner elements", function() {
    const elements = [
      {
        testElement: [ {} ]
      },
      {
        testElement: [ {}, {} ]
      },
    ]

    const joined = joinElements(elements)
    expect(joined).to.have.property('testElement').with.length(3)
  })

  it("should add inner elements that only on a single element", function() {
    const elements = [
      {
        testElement: [ {} ]
      },
      {},
      {}
    ]

    const joined = joinElements(elements)
    expect(joined).to.have.property('testElement').with.length(1)
  })
})
