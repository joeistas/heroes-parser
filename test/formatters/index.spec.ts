import { expect } from 'chai'
import * as sinon from 'sinon'

import { formatElement } from '../../src/formatters/index'
import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY } from '../../src/element'

describe("formatElement", function() {
  it("should return a new object", function() {
    const element = {}

    const result = formatElement(element, {}, { functions: { default: {} } } as any)
    expect(result).to.not.equal(element)
  })

  it("should add all attributes to the returned objects with the keys formatted using the defaultKeyFormatter", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        id: 'test',
        value: 'thing',
        Effect: 'effect',
      }
    }

    const result = formatElement(element, {}, { functions: { default: {} } } as any)
    expect(result).to.eql({
      id: 'test',
      value: 'thing',
      effect: 'effect',
    })
  })

  it("should not include the element name in the formatted object", function() {
    const element = { [ELEMENT_NAME_KEY]: 'testElement' }

    const result = formatElement(element, {}, { functions: { default: {} } } as any)
    expect(result).to.not.have.key(ELEMENT_NAME_KEY)
  })

  it("should not include the attributes key in the formatted object", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
      }
    }

    const result = formatElement(element, {}, { functions: { default: {} } } as any)
    expect(result).to.not.have.key(ELEMENT_ATTRIBUTE_KEY)
  })

  it("should call 'formatElement' for all innerElements", function() {
    const element = {
      innerElements: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          }
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          }
        }
      ]
    }

    const result = formatElement(element, {}, { functions: { default: {} } } as any)
    expect(result).to.eql({
      innerElements: [
        { value: 'thing' },
        { value: 'thing2' },
      ],
    })
  })

  it("should remove any inner elements that are null or undefined after formatting", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {},
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {
        formatElement: (formattedElement: any, element: any) => formattedElement.value == 'thing' ? null : formattedElement
      },
    }

    const result = formatElement(element, {}, { functions } as any)
    expect(result.innerElement).to.have.length(1)
  })

  it("should call the appropriate 'formatKey' function for each inner element key", function() {
    const element = {
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      innerElement: {
        formatKey: sinon.stub().returns('innerElement')
      }
    }

    formatElement(element, {}, { functions } as any)

    expect(functions.innerElement.formatKey).to.have.been.calledWith('innerElement')
  })

  it("should use the value for 'formatKey' as the key if it is a string", function() {
    const element = {
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      innerElement: {
        formatKey: 'testElements'
      }
    }

    const result = formatElement(element, {}, { functions } as any)
    expect(result).to.have.property('testElements')
    expect(result).to.not.have.property('innerElement')
  })

  it("should call the appropriate 'formatArray' function for each inner element key", function() {
    const element = {
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      innerElement: {
        formatArray: sinon.stub().returns(element.innerElement)
      }
    }

    formatElement(element, {}, { functions } as any)

    expect(functions.innerElement.formatArray.args[0][0]).to.eql([ { value: 'thing' }, { value: 'thing2' }])
  })

  it("should not set the key for inner elements if the formatted value is null", function() {
    const element = {
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      innerElement: {
        formatArray: (elements: any[]): any => null
      }
    }

    const result = formatElement(element, {}, { functions } as any)
    expect(result).to.not.have.key('innerElement')
  })

  it("should merge the formatted inner elements to the element if 'mergeOntoOuterElement' is set to true", function() {
    const element = {
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      innerElement: {
        formatArray: (elements: any[]): any => { return { ...elements[0], mergeOntoOuterElement: true } }
      }
    }

    const result = formatElement(element, {}, { functions } as any)
    expect(result).to.eql({ value: 'thing' })
  })

  it("should not set 'mergeOntoOuterElement' on the formatted element", function() {
    const element = {
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      innerElement: {
        formatArray: (elements: any[]): any => { return { ...elements[0], mergeOntoOuterElement: true } }
      }
    }

    const result = formatElement(element, {}, { functions } as any)
    expect(result).to.not.have.key('mergeOntoOuterElement')
  })

  it("should call the correct 'formatElement' for the element", function() {
    const element = {
      [ELEMENT_NAME_KEY]: 'element',
      innerElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        },
        {
          [ELEMENT_ATTRIBUTE_KEY]: {
            value: 'thing2',
          },
          [ELEMENT_NAME_KEY]: 'innerElement'
        }
      ]
    }

    const functions = {
      default: {},
      element: {
        formatElement: sinon.stub().returns({})
      },
      innerElement: {
        formatElement: sinon.stub().returns({})
      }
    }

    formatElement(element, {}, { functions } as any)

    expect(functions.element.formatElement).to.have.been.called
    expect(functions.innerElement.formatElement).to.have.been.calledTwice
  })

  it("should return the formattedElement if 'formatElement' does not exist for the element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        index: 'test'
      }
    }

    const functions = {
      default: {}
    }

    expect(formatElement(element, {}, { functions } as any)).to.eql({ value: 'thing', index: 'test' })
  })
})
