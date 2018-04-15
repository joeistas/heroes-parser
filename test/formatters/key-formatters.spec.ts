import { expect } from 'chai'
import * as sinon from 'sinon'

import * as keyFormatters from '../../src/formatters/key-formatters'

describe("defaultKeyFormatter", function() {
  it("should remove 'Array' from the end of keys", function() {
    expect(keyFormatters.defaultKeyFormatter('HeroArray')).to.not.contain('Array')
  })

  it("should convert the frist character to lower case", function() {
    expect(keyFormatters.defaultKeyFormatter('HeroArray').startsWith('h')).to.be.true
  })
})

describe("removeArrayFromKey", function() {
  it("should remove 'Array' from the end of the key", function() {
    expect(keyFormatters.removeArrayFromKey('HeroArray')).to.equal('Hero')
  })

  it("should return the key unchanged if it doesn't end with Array", function() {
    expect(keyFormatters.removeArrayFromKey('Value')).to.equal('Value')
  })
})

it("lowerCaseFirstCharacter should convert the first character to lower case", function() {
  expect(keyFormatters.lowerCaseFirstCharacter('Value')).to.equal('value')
})

it("pluralizeKey to convert the key to the plural form", function() {
  expect(keyFormatters.pluralizeKey('Value')).to.equal("Values")
})

describe("join key formatters", function() {
  it("should call each formatter with key from the previous formatter", function() {
    const formatter1 = sinon.stub().returns('thing')
    const formatter2 = sinon.spy()

    keyFormatters.join(formatter1, formatter2)('test')
    expect(formatter1).to.have.been.calledWith('test')
    expect(formatter2).to.have.been.calledWith('thing')
  })

  it("should return the result of all of the formatters", function() {
    const formatter1 = (key: string) => key + 'value'
    const formatter2 = (key: string) => key.replace(/e/g, 'z')

    const result = keyFormatters.join(formatter1, formatter2)('test')
    expect(result).to.equal('tzstvaluz')
  })

  it("should return the original key if any of the formatter returns null", function() {
    const formatter1 = (key: string) => key + 'value'
    const formatter2 = (key: string): string => null
    const formatter3 = (key: string) => key.replace('e', 'z')

    const result = keyFormatters.join(formatter1, formatter2, formatter3)('test')
    expect(result).to.equal('test')
  })
})
