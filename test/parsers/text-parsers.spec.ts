import { expect } from 'chai'
import * as sinon from 'sinon'
import * as cheerio from 'cheerio'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY, buildElement } from '../../src/element'
import {
  attributeValueReplacement,
  replaceWithLocaleText,
  parseTooltip,
  renderTooltip,
} from '../../src/parsers/text-parsers'
import { ParseContext } from '../../src/parsers/'
import { ParseData } from '../../src/parse-data'

describe("attributeValueReplacement", function() {
  it("should not change the element if 'attribute' doesn't exist on element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        test: 'thing',
        another: 'value'
      }
    }

    const result = attributeValueReplacement('value')(element, {}, {} as any, {} as any)
    expect(result).to.eql(element)
  })

  it("should not change the element if 'attribute' doesn't contain a replacement", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        test: 'thing',
        another: 'value'
      }
    }

    const result = attributeValueReplacement('another')(element, {}, {} as any, {} as any)
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

    const result = attributeValueReplacement('value')(element, {}, {} as any, { attributes: { test: "thing" } })
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

    const result = attributeValueReplacement('value')(element, {}, {} as any, { attributes: { test: "thing" } })
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

    const result = replaceWithLocaleText('text')(element, {}, {} as any, {} as any)
    expect(result).to.eql(element)
  })

  it("should replace the attribute value with an empty object if there is no text for the value in the TextMap", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing'
      }
    }

    const result = replaceWithLocaleText('text')(element, {}, {} as any, {} as any)
    expect(result).to.eql(element)
  })

  it("should replace the attribute value with an object containing all of the text versions", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'text'
      }
    }

    const result = replaceWithLocaleText('value')(element, {}, parseData, {} as any)
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.have.property('value').that.is.eql({
      'enus': "This is some text",
      'dede': "This is some text for another locale"
    })
  })
})

describe("parseTooltip", function() {
  beforeEach(function() {
    this.element = buildElement('tooltip', {
      'value': {
        "enus": "Beetles have <c val=\"#TooltipNumbers\"><d ref=\"Behavior,AnubarakResilientScarabsBeetleArmorBuffBehavior,ArmorModification.ArmorSet[Hero].ArmorMitigationTable[Ability]\"/></c> Spell Armor."
      }
    })
  })

  it("should return the original element if the attribute is not set", function() {
    const element = buildElement()
    expect(parseTooltip()(element, buildElement(), {} as ParseData, {} as ParseContext)).to.equal(element)
  })

  it("should set the attribute to a TooltipData object", function() {
    const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
    expect(result[ELEMENT_ATTRIBUTE_KEY].value).to.have.keys('localeText', 'formulas', 'references')
  })
})

describe("renderTooltip", function() {
  it("should return the original element if the attribute does not exist", function() {
    const element = buildElement()
    const result = renderTooltip()(element, buildElement(), {} as ParseData, {} as ParseContext)
    expect(element).to.equal(element)
    expect(element).to.eql(element)
  })

  it("should set the attritube to the rendered tooltip text", function() {
    const element = buildElement('tooltip', {
      'value': {
        localeText: {
          enus: "Increases the range of Symbiote's Spike Burst by {{ formula0 }}"
        },
        formulas: {
          formula0: "-30 * 20"
        },
        references: {},
        variables: {},
      }
    })

    const result = renderTooltip()(element, buildElement(), {} as ParseData, {} as ParseContext)
    const tooltip = result[ELEMENT_ATTRIBUTE_KEY].value.enus
    expect(tooltip).to.eql("Increases the range of Symbiote's Spike Burst by -600")
  })
})
