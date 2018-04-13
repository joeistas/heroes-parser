import { expect } from 'chai'
import * as sinon from 'sinon'

import * as arrayFormatters from '../../src/formatters/array-formatters'

describe("Element array conditionals", function() {
  describe("isEmpty", function() {
    it("should return true when the length of 'elements' is zero", function() {
      const elements: any[] = []

      expect(arrayFormatters.isEmpty(elements)).to.be.true
    })

    it("should return false when the length of 'elements' is not zero", function() {
      const elements: any[] = [ {} ]

      expect(arrayFormatters.isEmpty(elements)).to.be.false
    })
  })

  describe("elementsAreObject", function() {
    it("should return true when elements is empty", function() {
      const elements: any[] = []

      expect(arrayFormatters.elementsAreObjects(elements)).to.be.true
    })

    it("should return true when every element is an object", function() {
      const elements: any[] = [ {}, {} ]

      expect(arrayFormatters.elementsAreObjects(elements)).to.be.true
    })

    it("should return false when every element is not an object", function() {
      const elements: any[] = [ {}, 'string' ]

      expect(arrayFormatters.elementsAreObjects(elements)).to.be.false
    })

    it("should return false when at least one element is null", function() {
      const elements: any[] = [ {}, 'string' ]

      expect(arrayFormatters.elementsAreObjects(elements)).to.be.false
    })
  })
})

describe("Element array formatters", function() {
  describe("join", function() {
    it("should return null if elements is empty", function() {
      const formatters: (() => any[])[] = [ () => [], () => [] ]
      const elements: any[] = []

      expect(arrayFormatters.join(...formatters)(elements)).to.be.null
    })

    it("should return elements unchanged if no formatters are passed", function() {
      const elements: any[] = [ {}, {} ]

      expect(arrayFormatters.join()(elements)).to.eql(elements)
      expect(arrayFormatters.join()(elements)).to.equal(elements)
    })

    it("should call each formatter with the elements array and chain the results.", function() {
      const formatter1 = sinon.spy()
      const formatter2 = sinon.spy()
      const elements = [ {}, {} ]

      arrayFormatters.join(formatter1, formatter2)(elements)
      expect(formatter1).to.have.been.calledWith(elements)
      expect(formatter2).to.have.been.calledWith(elements)
    })
  })

  it("removeArray should return null", function() {
    const elements = [ {}, {} ]

    expect(arrayFormatters.removeArray(elements)).to.be.null
  })

  it("passThrough should return the elements array unchanged", function() {
    const elements = [ {}, {} ]

    expect(arrayFormatters.passThrough(elements)).to.equal(elements)
  })

  describe("conditionallyFormatArray", function() {
    it("should call the 'whenTrue' formatter when the conditional returns true", function() {
      const whenTrue = sinon.spy()
      const whenFalse = sinon.spy()
      const elements = [ {} ]

      arrayFormatters.conditionallyFormatArray(() => true, whenTrue, whenFalse)(elements)
      expect(whenTrue).to.have.been.calledWith(elements)
      expect(whenFalse).to.have.not.been.called
    })

    it("should call the 'whenFalse' formatter when the conditional returns false", function() {
      const whenTrue = sinon.spy()
      const whenFalse = sinon.spy()
      const elements = [ {} ]

      arrayFormatters.conditionallyFormatArray(() => false, whenTrue, whenFalse)(elements)
      expect(whenFalse).to.have.been.calledWith(elements)
      expect(whenTrue).to.have.not.been.called
    })
  })

  describe("reduceToSingleObject", function() {
    it("should return null when elements has a length of zero", function() {
      const elements: any[] = []

      expect(arrayFormatters.reduceToSingleObject()(elements)).to.be.null
    })

    it("should combine elements into a single object", function() {
      const elements: any[] = [
        { test: 'value', thing: 'test' },
        { another: 'value' },
      ]

      expect(arrayFormatters.reduceToSingleObject()(elements)).to.equal({ test: 'value', thing: 'thing', another: 'value' })
    })

    it("should return an object with the key 'mergeOntoOuterElement' set to 'true' if mergeOntoOuterElement is 'true'", function() {
      const elements: any[] = [
        { test: 'value', thing: 'test' },
        { another: 'value' },
      ]

      expect(arrayFormatters.reduceToSingleObject(true)(elements)).to.have.key('mergeOntoOuterElement').and.is.true
    })

    it("should not return a object whit the key 'mergeOntoOuterElement' if mergeOntoOuterElement is 'false'", function () {
      const elements: any[] = [
        { test: 'value', thing: 'test' },
        { another: 'value' },
      ]

      expect(arrayFormatters.reduceToSingleObject(false)(elements)).to.not.have.key('mergeOntoOuterElement')
    })
  })

  describe("firstValue", function() {
    it("should return null of when elements has a length of zero", function() {
      const elements: any[] = []

      expect(arrayFormatters.firstValue(elements)).to.be.null
    })

    it("should return the first element in elements", function() {
      const elements: any[] = [
        { first: true },
        { last: true },
      ]

      expect(arrayFormatters.firstValue(elements)).to.equal({ first: true })
    })
  })

  describe("lastValue", function() {
    it("should return null of when elements has a length of zero", function() {
      const elements: any[] = []

      expect(arrayFormatters.lastValue(elements)).to.be.null
    })

    it("should return the last element in elements", function() {
      const elements: any[] = [
        { first: true },
        { last: true },
      ]

      expect(arrayFormatters.lastValue(elements)).to.equal({ first: true })
    })
  })
})
