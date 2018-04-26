import { expect } from 'chai'
import * as sinon from 'sinon'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY } from '../../src/element'
import { addAttribute, addInnerElement } from '../../src/parsers/add-parsers'

describe("addAttribute", function() {
  it("should add attribute with 'value' to the element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
      }
    }

    const result = addAttribute('test', 'value')(element, null, {} as any, {})
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.include.keys('test')
    expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.equal('value')
  })

  it("should override an existing value if override is true", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'original'
      }
    }

    const result = addAttribute('test', 'value', true)(element, null, {} as any, {})
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.include.keys('test')
    expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.equal('value')
  })

  it("should not override an existing value if override is false", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'original'
      }
    }

    const result = addAttribute('test', 'value', false)(element, null, {} as any, {})
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.include.keys('test')
    expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.equal('original')
  })
})

describe("addInnerElement", function() {
  it("should not add an inner element if the attribute doesn't have a value", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
      }
    }

    const parseData: any = {
      functions: {
        default: {}
      }
    }

    const result = addInnerElement('test', 'innerElement', 'value')(element, {}, parseData, {})
    expect(result).to.eql(element)
  })

  it("should add an inner element at 'key'", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'text',
      }
    }

    const parseData: any = {
      functions: {
        default: {}
      }
    }

    const result = addInnerElement('test', 'innerElement', 'value')(element, {}, parseData, {})
    expect(result).to.include.keys('innerElement')
    expect(result.innerElement).to.have.length(1)
  })

  it("should add an inner element with an attribute with name from innerAttribute and value from element's attribute value", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'text',
      }
    }

    const parseData: any = {
      functions: {
        default: {}
      }
    }

    const result = addInnerElement('test', 'innerElement', 'thing')(element, {}, parseData, {})
    expect(result.innerElement[0][ELEMENT_ATTRIBUTE_KEY]).to.eql({ thing: 'text' })
  })

  it("should set the element name of the inner element to innerName if set", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'text',
      }
    }

    const parseData: any = {
      functions: {
        default: {}
      }
    }

    const result = addInnerElement('test', 'innerElement', 'thing', 'newElement')(element, {}, parseData, {})
    expect(result.innerElement[0][ELEMENT_NAME_KEY]).to.equal('newElement')
  })

  it("should set the element name of the inner element to key if innerName is not set", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'text',
      }
    }

    const parseData: any = {
      functions: {
        default: {}
      }
    }

    const result = addInnerElement('test', 'innerElement', 'thing')(element, {}, parseData, {})
    expect(result.innerElement[0][ELEMENT_NAME_KEY]).to.equal('innerElement')
  })

  it("should merge the element into key using the merge function of key", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: 'text',
      }
    }

    const parseData: any = {
      functions: {
        default: {},
        innerElement: {
          merge: sinon.spy()
        }
      }
    }

    const result = addInnerElement('test', 'innerElement', 'thing', 'newElement')(element, {}, parseData, {})
    expect(parseData.functions.innerElement.merge).to.have.been.called
  })
})
