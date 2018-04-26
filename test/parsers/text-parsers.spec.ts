import { expect } from 'chai'
import * as sinon from 'sinon'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY } from '../../src/element'
import { attributeValueReplacement, replaceWithLocaleText } from '../../src/parsers/text-parsers'

describe("attributeValueReplacement", function() {
  it("should not change the element if 'attribute' doesn't exist on element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        test: 'thing',
        another: 'value'
      }
    }

    const result = attributeValueReplacement('value')(element, {}, {} as any, {})
    expect(result).to.eql(element)
  })

  it("should not change the element if 'attribute' doesn't contain a replacement", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        test: 'thing',
        another: 'value'
      }
    }

    const result = attributeValueReplacement('another')(element, {}, {} as any, {})
    expect(result).to.eql(element)
  })

  it("should replace the text with the value from the parse context", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        test: 'thing',
        another: 'value',
        value: "thing_##test##",
      }
    }

    const result = attributeValueReplacement('value')(element, {}, {} as any, { test: "thing" })
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.have.property('value').that.is.eql('thing_thing')
  })

  it("should not change the attribute if the replacement value isn't in the parse context", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        test: 'thing',
        another: 'value',
        value: "thing_##another##",
      }
    }

    const result = attributeValueReplacement('value')(element, {}, {} as any, { test: "thing" })
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.have.property('value').that.is.eql("thing_##another##")
  })
})

describe("replaceWithLocaleText", function() {
  const parseData: any = {
    text: new Map(
      [
        [
          'text',
          new Map(
            [
              ['enus', "This is some text"],
              ['dede', "This is some text for another locale"],
            ]
          )
        ],
        [
          'name',
          new Map(
            [
              ['enus', "A Name!"]
            ]
          )
        ],
      ]
    )
  }

  it("should not change the element if the attribute is not defined", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'text'
      }
    }

    const result = replaceWithLocaleText('text')(element, {}, {} as any, {})
    expect(result).to.eql(element)
  })

  it("should replace the attribute value with an empty object if there is no text for the value in the TextMap", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing'
      }
    }

    const result = replaceWithLocaleText('text')(element, {}, {} as any, {})
    expect(result).to.eql(element)
  })

  it("should replace the attribute value with an object containing all of the text versions", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'text'
      }
    }

    const result = replaceWithLocaleText('value')(element, {}, parseData, {})
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.have.property('value').that.is.eql({
      'enus': "This is some text",
      'dede': "This is some text for another locale"
    })
  })
})
