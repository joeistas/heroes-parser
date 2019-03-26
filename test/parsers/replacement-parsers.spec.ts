import { expect } from 'chai'

import { buildElement, getElementAttributes } from '../../src/element'
import { ParseContext } from '../../src/parsers/'

import { replaceAttributesWithElementAttribute, replaceAttributeWithElementAttribute } from '../../src/parsers/replacement-parsers'

describe("replaceAttributeWithElementAttribute", function() {
  const parseData: any = {
    functions: {
      default: {
        merge: (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
      }
    },
    elements: new Map(
      [
        [
          'const',
          new Map([
            [
              '$const1',
              [
                buildElement(undefined, { value: "TestValue1" })
              ]
            ],
            [
              '$const2',
              [
                buildElement(undefined, { value: "TestValue2" })
              ]
            ],
          ])
        ]
      ]
    )
  }

  it("should return the original element if the attribute's value is undefined", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: "AttValue" })
    const testElement = buildElement(undefined, { ...getElementAttributes(element) })
    const parser = replaceAttributeWithElementAttribute('const', 'undefAtt', 'value')
    const result = parser(testElement, buildElement(), parseData, {} as ParseContext)

    expect(result).to.eql(element)
  })

  it("should return the original element if the replacement element cannot be found", function() {
    const element = buildElement(undefined, { testAtt: "$const47", anotherAtt: "AttValue" })
    const testElement = buildElement(undefined, { ...getElementAttributes(element) })
    const parser = replaceAttributeWithElementAttribute('const', 'testAtt', 'value')
    const result = parser(testElement, buildElement(), parseData, {} as ParseContext)

    expect(result).to.eql(element)
  })

  it("should return the original element if the valueAttribute is undefined in the replacement element", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: "AttValue" })
    const testElement = buildElement(undefined, { ...getElementAttributes(element) })
    const parser = replaceAttributeWithElementAttribute('const', 'testAtt', 'undefValue')
    const result = parser(testElement, buildElement(), parseData, {} as ParseContext)

    expect(result).to.eql(element)
  })

  it("should set the value of attriubte to the value in valueAttribute from the replacement element", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: "AttValue" })

    const parser = replaceAttributeWithElementAttribute('const', 'testAtt', 'value')
    const result = parser(element, buildElement(), parseData, {} as ParseContext)

    expect(getElementAttributes(result)).to.have.property("testAtt").and.eql("TestValue2")
  })
})

describe("replaceAttributesWithElementAttribute", function() {
  const parseData: any = {
    functions: {
      default: {
        merge: (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
      }
    },
    elements: new Map(
      [
        [
          'const',
          new Map([
            [
              '$const1',
              [
                buildElement(undefined, { value: "TestValue1" })
              ]
            ],
            [
              '$const2',
              [
                buildElement(undefined, { value: "TestValue2" })
              ]
            ],
          ])
        ]
      ]
    )
  }

  it("should replace every attribute in the element", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: "$const1" })
    const parser = replaceAttributesWithElementAttribute(/^\$.*/, 'const', 'value')
    const result = parser(element, buildElement(), parseData, {} as ParseContext)

    expect(getElementAttributes(result)).to.have.property("testAtt").and.eql("TestValue2")
    expect(getElementAttributes(result)).to.have.property("anotherAtt").and.eql("TestValue1")
  })

  it("should skip attributes that are undefined", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: undefined })
    const parser = replaceAttributesWithElementAttribute(/^\$.*/, 'const', 'value')
    const result = parser(element, buildElement(), parseData, {} as ParseContext)

    expect(getElementAttributes(result)).to.have.property("testAtt").and.eql("TestValue2")
    expect(getElementAttributes(result)).to.have.property("anotherAtt").and.is.undefined
  })

  it("should skip attributes that are not a string", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: false, numberAtt: 3 })
    const parser = replaceAttributesWithElementAttribute(/^\$.*/, 'const', 'value')
    const result = parser(element, buildElement(), parseData, {} as ParseContext)

    expect(getElementAttributes(result)).to.have.property("testAtt").and.eql("TestValue2")
    expect(getElementAttributes(result)).to.have.property("anotherAtt").to.be.false
    expect(getElementAttributes(result)).to.have.property("numberAtt").to.equal(3)
  })

  it("should skip attributes that don't match the regular expression", function() {
    const element = buildElement(undefined, { testAtt: "$const2", anotherAtt: "The Value" })
    const parser = replaceAttributesWithElementAttribute(/^\$.*/, 'const', 'value')
    const result = parser(element, buildElement(), parseData, {} as ParseContext)

    expect(getElementAttributes(result)).to.have.property("testAtt").and.eql("TestValue2")
    expect(getElementAttributes(result)).to.have.property("anotherAtt").and.eql("The Value")
  })
})
