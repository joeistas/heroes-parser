import { expect } from 'chai'
import * as sinon from 'sinon'

import * as elementFormatters from '../../src/formatters/element-formatters'

describe("Element conditionals", function() {
  describe("isEmpty", function() {
    it("should return true when 'formattedElement' is empty", function() {
      expect(elementFormatters.isEmpty({}, {})).to.be.true
    })

    it("should return false when 'formattedElement' is not empty", function() {
      expect(elementFormatters.isEmpty({ test: 'thing' }, {})).to.be.false
    })
  })

  describe("attributeIsDefined", function() {
    it("should return true if the attribute is defined on 'formattedElement'", function() {
      const formattedElement = { test: 'thing' }

      expect(elementFormatters.attributeIsDefined('test')(formattedElement, {})).to.be.true
    })

    it("should return false if the attribute is not set on 'formattedElement'", function() {
      const formattedElement = { test: 'thing' }

      expect(elementFormatters.attributeIsDefined('thing')(formattedElement, {})).to.be.false
    })

    it("should return false if the attribute is null on 'formattedElement'", function() {
      const formattedElement: any = { test: 'thing', thing: null }

      expect(elementFormatters.attributeIsDefined('thing')(formattedElement, {})).to.be.false
    })

    it("should return false if the attribute is undefined on 'formattedElement'", function() {
      const formattedElement: any = { test: 'thing', thing: undefined }

      expect(elementFormatters.attributeIsDefined('thing')(formattedElement, {})).to.be.false
    })
  })

  describe("attributeHasValue", function() {
    it("should return true if the attribute value in 'formattedElement' is equal to 'attributeValue'", function() {
      const formattedElement: any = { test: 'thing' }

      expect(elementFormatters.attributeHasValue('thing', 'test')(formattedElement, {})).to.be.true
    })

    it("should return false if the attribute value in 'formattedElement' is not equal to 'attributeValue'", function() {
      const formattedElement: any = { test: 'space' }

      expect(elementFormatters.attributeHasValue('thing', 'test')(formattedElement, {})).to.be.false
    })
  })

  describe("some", function() {
    it("should return true if one of the conditionals are true", function() {
      const conditionals = [
        () => false,
        () => true,
        () => false,
      ]

      expect(elementFormatters.some(...conditionals)({}, {})).to.be.true
    })

    it("should return true if all of the conditionals are true", function() {
      const conditionals = [
        () => true,
        () => true,
        () => true,
      ]

      expect(elementFormatters.some(...conditionals)({}, {})).to.be.true
    })

    it("should return false if none of the conditionals are true", function() {
      const conditionals = [
        () => false,
        () => false,
        () => false,
      ]

      expect(elementFormatters.some(...conditionals)({}, {})).to.be.false
    })

    it("shold call each conditional with formattedElement and element", function() {
      const conditionals = [
        sinon.spy(),
        sinon.spy(),
      ]

      const formattedElement = {}
      const element = {}

      elementFormatters.some(...conditionals)(formattedElement, element)

      expect(conditionals[0]).to.have.been.calledWith(formattedElement, element)
      expect(conditionals[1]).to.have.been.calledWith(formattedElement, element)
    })
  })
})

it("removeFromOutput should return null", function() {
  expect(elementFormatters.removeFromOutput({}, {})).to.be.null
})

it("passthrough should return the original 'formattedElement' unchanged", function() {
  const element = {}
  const result = elementFormatters.passThrough(element, {})
  expect(result).to.eql(result).and.to.equal(result)
})

describe("join", function() {
  it("should call all of the formatters with element and formattedElement", function() {
    const formattedElement = {}
    const element = {}

    const formatter1 = sinon.stub().returns(formattedElement)
    const formatter2 = sinon.stub().returns(formattedElement)

    elementFormatters.join(formatter1, formatter2)(formattedElement, element)

    expect(formatter1).to.have.been.calledWith(formattedElement, element)
    expect(formatter2).to.have.been.calledWith(formattedElement, element)
  })

  it("should return null if any of the formatters return null", function() {
    const formattedElement = {}
    const element = {}

    const formatter1 = (): any => null
    const formatter2 = (formattedElement: any) => formattedElement

    const result = elementFormatters.join(formatter1, formatter2)(formattedElement, element)

    expect(result).to.be.null
  })

  it("should return formattedElement formatted by all of the formatters", function() {
    const formattedElement = {}
    const element = {}

    const formatter1 = (formattedElement: any): any => { return { ...formattedElement, test: 'thing' } }
    const formatter2 = (formattedElement: any) => { return { ...formattedElement, another: 'test' } }

    const result = elementFormatters.join(formatter1, formatter2)(formattedElement, element)

    expect(result).to.eql({ test: 'thing', another: 'test' })
  })
})

describe("conditionallyFormatElement", function() {
  it("should return the result of the 'whenTrue' formatter when 'condition' is true", function() {
    const formattedElement = {}
    const element = {}

    const whenTrue = sinon.stub().returns('test')
    const whenFalse = sinon.spy()

    const result = elementFormatters.conditionallyFormatElement(() => true, whenTrue, whenFalse)(formattedElement, element)

    expect(result).to.equal('test')
    expect(whenTrue).to.have.been.calledWith(formattedElement, element)
    expect(whenFalse).to.not.have.been.called
  })

  it("should return the result of the 'whenFalse' formatter when 'condition' is false", function() {
    const formattedElement = {}
    const element = {}

    const whenTrue = sinon.spy()
    const whenFalse = sinon.stub().returns('test')

    const result = elementFormatters.conditionallyFormatElement(() => false, whenTrue, whenFalse)(formattedElement, element)

    expect(result).to.equal('test')
    expect(whenTrue).to.not.have.been.called
    expect(whenFalse).to.have.been.calledWith(formattedElement, element)
  })
})

describe("removeIfEmptyObject", function() {
  it("should return formattedElement if it is not empty", function() {
    const formattedElement = { test: 'thing' }

    expect(elementFormatters.removeIfEmptyObject(formattedElement, {})).to.eql({ test: 'thing' })
  })

  it("should return null if formattedElement is empy", function() {
    expect(elementFormatters.removeIfEmptyObject({}, {})).to.be.null
  })
})

it("valueFromAttribute should return the value from the specified attribute", function() {
  const formattedElement = { test: 'thing' }

  expect(elementFormatters.valueFromAttribute('test')(formattedElement, {})).to.eql('thing')
})

describe("valueToBoolean", function() {
  it("should return true if formattedElement is equal to 'trueValue'", function() {
    expect(elementFormatters.valueToBoolean('True', 'False')('True', {})).to.be.true
  })

  it("should return false if formattedElement is equal to 'falseValue'", function() {
    expect(elementFormatters.valueToBoolean('True', 'False')('False', {})).to.be.false
  })

  it("should return formattedElement if it isn't equal to either trueValue or falseValue", function() {
    expect(elementFormatters.valueToBoolean('True', 'False')('test', {})).to.eql('test')
  })
})

describe("valueToNumber", function() {
  it("should return formattedElement converted to a number if formattedElement can be converted to a number", function() {
    expect(elementFormatters.valueToNumber('32', {})).to.equal(32)
  })

  it("should return formattedElement unchanged if it cannot be converted to a number", function() {
    expect(elementFormatters.valueToNumber('test', {})).to.equal('test')
  })
})

describe("splitOnCaps", function() {
  it("should split the text into words on capital letters", function() {
    expect(elementFormatters.splitOnCaps("VeryHard", {})).to.equal("Very Hard")
  })

  it("should not split acronyms written in capital letters", function() {
    expect(elementFormatters.splitOnCaps("VOArray", {})).to.equal("VO Array")
  })
})

it("attributeToBoolean should convert the spicifed attribute to a boolean", function() {
  expect(elementFormatters.attributeToBoolean('test')({ test: '1' }, {})).to.eql({ test: true })
})

it("attributeToNumber should convert the spicifed attribute to a number", function() {
  expect(elementFormatters.attributeToNumber('test')({ test: '1' }, {})).to.eql({ test: 1 })
})

it("formatAttributeWithKeyFormatter should format the attribute value with the key formatter", function() {
  const formatter = elementFormatters.formatAttributeWithKeyFormatter(() => 'thing', 'test')
  expect(formatter({ test: 'value' }, {})).to.eql({ test: 'thing' })
})

it("toKeyValuePair should return an object with key value from keyAttribute and value from valueAttribute", function() {
  const formatter = elementFormatters.toKeyValuePair('test', 'thing')
  expect(formatter({ test: 'value', thing: 'another' }, {})).to.eql({ value: 'another' })
})

describe("parseFilterString", function() {
  it("should return an object with common seperated values left of the ';' set to true", function() {
    const filters = "thing,another;"

    expect(elementFormatters.parseFilterString(filters, {})).to.eql({
      thing: true,
      another: true,
    })
  })

  it("should return an object with common seperated values right of the ';' set to false", function() {
    const filters = ";thing,another"

    expect(elementFormatters.parseFilterString(filters, {})).to.eql({
      thing: false,
      another: false,
    })
  })

  it("should not set a '-' key if left of the ';'", function() {
    const filters = "-;thing,another"

    expect(elementFormatters.parseFilterString(filters, {})).to.eql({
      thing: false,
      another: false,
    })
  })

  it("should not set a '-' key if right of the ';'", function() {
    const filters = "thing,another;-"

    expect(elementFormatters.parseFilterString(filters, {})).to.eql({
      thing: true,
      another: true,
    })
  })

  it("should reutrn an object with value left of ';' set to true and value right of ';' to false", function() {
    const filters = "thing,another;filter"

    expect(elementFormatters.parseFilterString(filters, {})).to.eql({
      thing: true,
      another: true,
      filter: false,
    })
  })
})

it("removeKeyFromElement should remove the specified key from the returned object", function() {
  const formattedElement = { test: 'value', another: 'thing' }

  expect(elementFormatters.removeKeyFromElement('another')(formattedElement, {})).to.eql({ test: 'value' })
})
