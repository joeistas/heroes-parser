import { expect } from 'chai'
import * as sinon from 'sinon'
import * as cheerio from 'cheerio'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY, buildElement } from '../../src/element'
import {
  attributeValueReplacement,
  replaceWithLocaleText,
  parseTooltip,
  renderTooltip,
  handleBarsTemplateReplacement,
  toSpanElement,
  renderTooltipWithHandlebars,
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

describe("parseTooltip", function() {
  beforeEach(function() {
    this.element = buildElement('tooltip', {
      'value': "Beetles have <c val=\"#TooltipNumbers\"><d ref=\"Behavior,AnubarakResilientScarabsBeetleArmorBuffBehavior,ArmorModification.ArmorSet[Hero].ArmorMitigationTable[Ability]\"/></c> Spell Armor."
    })
  })

  it("should return the original element if the attribute is not set", function() {
    const element = buildElement()
    expect(parseTooltip()(element, buildElement(), {} as ParseData, {} as ParseContext)).to.equal(element)
  })

  it("should call 'templateElement' function for every 'c' element in the tooltip text", function() {
    const templateSpy = sinon.spy(toSpanElement)
    parseTooltip('value', handleBarsTemplateReplacement, templateSpy)(this.element, buildElement(), {} as ParseData, {} as ParseContext)
    expect(templateSpy).to.have.been.calledOnce
  })

  it("should call 'formulaElement' function for every 'd' element in the tooltip text", function() {
    const formulaSpy = sinon.spy(handleBarsTemplateReplacement)
    parseTooltip('value', formulaSpy)(this.element, buildElement(), {} as ParseData, {} as ParseContext)
    expect(formulaSpy).to.have.been.calledOnce
  })

  it("should set the attribute to a TooltipData object", function() {
    const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
    expect(result[ELEMENT_ATTRIBUTE_KEY].value).to.have.keys('text', 'formulas', 'references')
  })

  describe("TooltipData", function() {
    beforeEach(function() {
      this.element = buildElement('tooltip', {
        'value': "Increases the range of Symbiote's Spike Burst by <c val=\"#TooltipNumbers\"><d ref=\"(Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray[0].Radius*100)\" player=\"0\"/>%</c> and decreases the cooldown by <c val=\"#TooltipNumbers\"><d ref=\"-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[4].Value\" player=\"0\"/></c> second."
      })
    })

    describe("text", function() {
      it("should replace every 'c' element with the result of 'templateElement' function", function() {
        const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
        const $ = cheerio.load(result[ELEMENT_ATTRIBUTE_KEY].value.text)
        expect($('span')).to.have.length(2)
      })

      it("should replace every 'd' element with the result of 'formulaElement' function", function() {
        const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
        expect(result[ELEMENT_ATTRIBUTE_KEY].value.text).to.match(/{{ formula0 }}/)
        expect(result[ELEMENT_ATTRIBUTE_KEY].value.text).to.match(/{{ formula1 }}/)
      })
    })

    describe("formulas", function() {
      beforeEach(function() {
        this.element = buildElement('tooltip', {
          'value': "Increases the range of Symbiote's Spike Burst by <c val=\"#TooltipNumbers\"><d ref=\"(Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray[0].Radius*100)\" player=\"0\"/>%</c> and decreases the cooldown by <c val=\"#TooltipNumbers\"><d ref=\"-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[4].Value\" player=\"0\"/></c> second."
        })
      })

      it("should set a formula for every 'd' element in the tooltip text", function() {
        const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
        const formulas = result[ELEMENT_ATTRIBUTE_KEY].value.formulas
        expect(Object.keys(formulas)).to.have.length(2)
      })

      it("every formula value should be pulled from the 'd' element 'ref' attribute", function() {
        const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
        const formulas = result[ELEMENT_ATTRIBUTE_KEY].value.formulas

        expect(formulas.formula0).to.eql("(ref0/ref1*100)")
        expect(formulas.formula1).to.eql("-ref2")
      })

      it("should replace each element reference with an unique variable name", function() {
        const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
        const formulas = result[ELEMENT_ATTRIBUTE_KEY].value.formulas

        expect(formulas.formula0).to.match(/ref0/)
        expect(formulas.formula0).to.match(/ref1/)
        expect(formulas.formula1).to.match(/ref2/)
      })
    })

    describe("references", function() {
      beforeEach(function() {
        this.element = buildElement('tooltip', {
          'value': "Increases the range of Symbiote's Spike Burst by <c val=\"#TooltipNumbers\"><d ref=\"(Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray[0].Radius*100)\" player=\"0\"/>%</c> and decreases the cooldown by <c val=\"#TooltipNumbers\"><d ref=\"-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value\" player=\"0\"/></c> second."
        })

        const result = parseTooltip()(this.element, buildElement(), {} as ParseData, {} as ParseContext)
        this.references = result[ELEMENT_ATTRIBUTE_KEY].value.references
        this.ref0 = this.references.ref0
      })

      it("should add a reference for each unique element reference in the tooltip text", function() {
        expect(Object.keys(this.references)).to.have.length(2)
      })

      it("should not set the variable name in the reference data", function() {
        expect(this.ref0).to.not.have.property('variable')
      })

      it("should set the catalog to the first comma separated value in the reference in the tooltip text", function() {
        expect(this.ref0).to.have.property('catalog').and.equal("Talent")
      })

      it("should set the entry to the second comma separated value in the reference in the tooltip text", function() {
        expect(this.ref0).to.have.property('entry').and.equal("AbathurMasteryPressurizedGlands")
      })

      it("should set the field to the third comma separated value in the reference in the tooltip text", function() {
        expect(this.ref0).to.have.property('field').and.equal("AbilityModificationArray.0.Modifications.0.Value")
      })

      it("should replace all '[' characters with a period from 'field'", function() {
        expect(this.ref0.field).to.match(/AbilityModificationArray\./)
      })

      it("should remove all ']' characters from 'field'", function() {
        expect(this.ref0.field).to.not.match(/\]/)
      })
    })
  })
})

describe("renderTooltip", function() {
  it("should return the original element if the attribute does not exist", function() {
    const element = buildElement()
    const result = renderTooltip()(element, buildElement(), {} as ParseData, {} as ParseContext)
    expect(element).to.equal(element)
    expect(element).to.eql(element)
  })

  it("should call 'render'", function() {
    const element = buildElement('tooltip', {
      'value': {
        text: "Increases the range of Symbiote's Spike Burst",
        formulas: {},
        references: {},
      }
    })

    const renderSpy = sinon.spy(renderTooltipWithHandlebars)

    renderTooltip('value', renderSpy)(element, buildElement(), {} as ParseData, {} as ParseContext)

    expect(renderSpy).to.have.been.calledOnce
  })

  it("should replace each formula reference with the result of the formula", function() {
    const element = buildElement('tooltip', {
      'value': {
        text: "Increases the range of Symbiote's Spike Burst by {{ formula0 }}",
        formulas: {
          formula0: "-30 * 20"
        },
        references: {},
      }
    })

    const result = renderTooltip()(element, buildElement(), {} as ParseData, {} as ParseContext)
    const tooltip = result[ELEMENT_ATTRIBUTE_KEY].value
    expect(tooltip).to.eql("Increases the range of Symbiote's Spike Burst by -600")
  })

  it("should replace each reference with the values found in the element map", function() {
    const elements = new Map([
      [
        'CEffectAbil',
        new Map([
          [
            'symbioterange',
            [
              {
                ...buildElement('CEffectAbil', { id: 'SymbioteRange' }),
                Value: [
                  buildElement(null, { value: '60' })
                ]
              }
            ]
          ]
        ])
      ]
    ])

    const functions = {
      default: {
        merge: (parent: any[], child: any[]) => parent.concat(child)
      }
    }

    const element = buildElement('tooltip', {
      'value': {
        text: "Increases the range of Symbiote's Spike Burst by {{ formula0 }}",
        formulas: {
          formula0: "0 + ref0 * 2"
        },
        references: {
          ref0: {
            catalog: 'Effect',
            entry: 'SymbioteRange',
            field: 'Value'
          }
        },
      }
    })

    const result = renderTooltip()(element, buildElement(), { elements, functions } as any, {} as ParseContext)
    const tooltip = result[ELEMENT_ATTRIBUTE_KEY].value
    expect(tooltip).to.eql("Increases the range of Symbiote's Spike Burst by 120")
  })
})
