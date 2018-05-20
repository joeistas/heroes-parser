import { expect } from 'chai'
import * as sinon from 'sinon'
import * as cheerio from 'cheerio'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY, buildElement } from '../src/element'
import {
  TooltipData,
  handleBarsTemplateReplacement,
  toSpanElement,
  renderTooltipWithHandlebars,
  parseTooltipLocaleText,
  parseFormula,
  parseVariable,
  parseVariableToken,
  parseVariableReference,
  parseReference,
  renderTooltipData,
} from '../src/tooltip'
import { ParseContext } from '../src/parsers/'
import { ParseData } from '../src/parse-data'

describe("parseTooltipLocaleText", function() {
  const localeText = {
    "enus": "Increases the range of Symbiote's Spike Burst by <c val=\"#TooltipNumbers\"><d ref=\"(Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray[0].Radius*100)\" player=\"0\"/>%</c> and decreases the cooldown by <c val=\"#TooltipNumbers\"><d ref=\"-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[4].Value\" player=\"0\"/></c> second."
  }

  it("should call 'templateElement' function for every 'c' element in the tooltip text", function() {
    const templateSpy = sinon.spy(toSpanElement)
    parseTooltipLocaleText(localeText, {} as ParseData, handleBarsTemplateReplacement, templateSpy)
    expect(templateSpy).to.have.been.calledTwice
  })

  it("should call 'formulaElement' function for every 'd' element in the tooltip text", function() {
    const formulaSpy = sinon.spy(handleBarsTemplateReplacement)
    parseTooltipLocaleText(localeText, {} as ParseData, formulaSpy)
    expect(formulaSpy).to.have.been.calledTwice
  })

  it("should replace every 'c' element with the result of 'templateElement' function", function() {
    const result = parseTooltipLocaleText(localeText, {} as ParseData)
    const $ = cheerio.load(result.localeText.enus)
    expect($('span')).to.have.length(2)
  })

  it("should replace every 'd' element with the result of 'formulaElement' function", function() {
    const result = parseTooltipLocaleText(localeText, {} as ParseData)
    expect(result.localeText.enus).to.match(/{{ formula0 }}/)
    expect(result.localeText.enus).to.match(/{{ formula1 }}/)
  })

  it("should set a formula for every 'd' element in the tooltip text", function() {
    const result = parseTooltipLocaleText(localeText, {} as ParseData)
    const formulas = result.formulas
    expect(Object.keys(formulas)).to.have.length(2)
  })

  it("every formula value should be pulled from the 'd' element 'ref' attribute", function() {
    const result = parseTooltipLocaleText(localeText, {} as ParseData)
    const formulas = result.formulas

    expect(formulas.formula0).to.eql("(ref0/ref1*100)")
    expect(formulas.formula1).to.eql("-ref2")
  })
})

describe("renderTooltipData", function() {
  it("should call 'render'", function() {
    const tooltipData = {
      localeText: {
        enus: "Increases the range of Symbiote's Spike Burst"
      },
      formulas: {},
      references: {},
      variables: {},
    }

    const renderSpy = sinon.spy(renderTooltipWithHandlebars)

    renderTooltipData(tooltipData, {} as ParseData, renderSpy)

    expect(renderSpy).to.have.been.calledOnce
  })

  it("should replace each reference with the values found in the element map", function() {
    const elements = new Map([
      [
        'CEffectDamage',
        new Map([
          [
            'symbioterange',
            [
              {
                ...buildElement('CEffectDamage', { id: 'SymbioteRange' }),
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

    const tooltipData = {
      localeText: {
        enus: "Increases the range of Symbiote's Spike Burst by {{ formula0 }}"
      },
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
      variables: {}
    }

    const result = renderTooltipData(tooltipData, { elements, functions } as any)
    expect(result.enus).to.eql("Increases the range of Symbiote's Spike Burst by 120")
  })

  it("should default a variable to it's min value if it is not set in variableValues", function() {
    const tooltipData = {
      localeText: {
        enus: "Increases the range of Symbiote's Spike Burst by {{ formula0 }}"
      },
      formulas: {
        formula0: "0 + var0 * 2"
      },
      references: {},
      variables: {
        var0: {
          counter: 'SymbioteBehavior',
          min: 5,
          max: 35,
          scale: 2,
        }
      }
    }

    const result = renderTooltipData(tooltipData, {} as any)
    expect(result.enus).to.eql("Increases the range of Symbiote's Spike Burst by 10")
  })

  it("should set a variable to the value set in variableValues", function() {
    const tooltipData = {
      localeText: {
        enus: "Increases the range of Symbiote's Spike Burst by {{ formula0 }}"
      },
      formulas: {
        formula0: "0 + var0 * 2"
      },
      references: {},
      variables: {
        var0: {
          counter: 'SymbioteBehavior',
          min: 5,
          max: 35,
          scale: 2,
        }
      }
    }

    const result = renderTooltipData(tooltipData, {} as any, undefined, { var0: 35 })
    expect(result.enus).to.eql("Increases the range of Symbiote's Spike Burst by 70")
  })
})

describe("parseFormula", function() {
  it("should return '0' if formula is not defined", function() {
    const result = parseFormula(undefined, new Map(), new Map(), {} as ParseData)
    expect(result).to.equal('0')
  })

  it("should convert sequences that begin with a capital letter and contain letters and '.,[]:' characters to a reference", function() {
    const formula = "Effect,RaynorAdrenalineRushHealer,RechargeVitalRate.Value[0]"
    const references = new Map()

    const result = parseFormula(formula, references, new Map(), {} as ParseData)
    expect(references.has("Effect,RaynorAdrenalineRushHealer,RechargeVitalRate.Value[0]")).to.be.true
  })

  it("should replace references with 'ref' identifiers", function() {
    const formula = "Effect,RaynorAdrenalineRushHealer,RechargeVitalRate.Value[0]"
    const result = parseFormula(formula, new Map(), new Map(), {} as ParseData)
    expect(result).to.match(/ref0/)
  })

  it("should convert sequences that begin and end with a '$' and contain letters and '.,[]:' characters to a variable", function() {
    const elements = new Map([
      [
        'CBehavior',
        new Map([
          [
            'symbioterange',
            [
              {
                ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                Value: [
                  buildElement(null, { value: '60' })
                ],
                Max: [
                  buildElement(null, { value: '20' })
                ]
              }
            ]
          ],
        ])
      ],
    ])

    const parseData = {
      elements,
      functions: {
        default: {
          merge: (parent: any[], child: any[]) => parent.concat(child)
        }
      }
    }

    const formula = "$BehaviorStackCount:SymbioteRange$"
    const variables = new Map()

    parseFormula(formula, new Map(), variables, parseData as any)
    expect(variables.has("BehaviorStackCount:SymbioteRange"))
  })

  it("should replace variables with 'var' identifiers and add variable info to variables", function() {
    const elements = new Map([
      [
        'CBehavior',
        new Map([
          [
            'symbioterange',
            [
              {
                ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                Value: [
                  buildElement(null, { value: '60' })
                ],
                Max: [
                  buildElement(null, { value: '20' })
                ]
              }
            ]
          ],
        ])
      ],
    ])

    const parseData = {
      elements,
      functions: {
        default: {
          merge: (parent: any[], child: any[]) => parent.concat(child)
        }
      }
    }

    const formula = "$BehaviorStackCount:SymbioteRange$"
    const variables = new Map()

    const result = parseFormula(formula, new Map(), variables, parseData as any)
    expect(result).to.match(/var0/)
  })

  it("should handle sub d elements ([d ref='' ]) in the tooltip text", function() {
    const formula = `Effect,RaynorAdrenalineRushHealer,RechargeVitalRate * [d ref='Effect,RaynorAdrenalineRushPersistent,PeriodCount' player='0'/]`
    const references = new Map()

    const result = parseFormula(formula, references, new Map(), {} as ParseData)
    expect(result).to.not.be.null
    expect(result).to.equal("ref0 * ref1")
    expect(references.has('Effect,RaynorAdrenalineRushPersistent,PeriodCount')).to.be.true
    expect(references.get('Effect,RaynorAdrenalineRushPersistent,PeriodCount')).to.eql({
      catalog: "Effect",
      entry: "RaynorAdrenalineRushPersistent",
      field: "PeriodCount",
      name: 'ref1'
    })
  })
})

describe("parseVariable", function() {
  beforeEach(function() {
    const elements = new Map([
      [
        'CBehavior',
        new Map([
          [
            'symbioterange',
            [
              {
                ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                Value: [
                  buildElement(null, { value: '60' })
                ],
                Max: [
                  buildElement(null, { value: '20' })
                ]
              }
            ]
          ],
        ])
      ],
    ])

    this.parseData = {
      elements,
      functions: {
        default: {
          merge: (parent: any[], child: any[]) => parent.concat(child)
        }
      }
    }
  })

  it("should add a new value to variables if a unique variable has been found", function() {
    const variables = new Map()
    parseVariable("BehaviorStackCount:SymbioteRange", variables, this.parseData)
    expect(variables.size).to.equal(1)
  })

  it("should not add a new value to variables if that variable has already been parsed", function() {
    const variables = new Map([
      [
        "BehaviorStackCount:SymbioteRange",
        {
          counter: "SymbioteRange",
          min: 0,
          max: 1,
          scale: 1,
        }
      ]
    ])

    parseVariable("BehaviorStackCount:SymbioteRange", variables, this.parseData)
    expect(variables.size).to.equal(1)
  })

  it("should be able to parse reference variables", function() {
    const variables = new Map()
    parseVariable("AccumulatorCount:Behavior,SymbioteRange,Modification", variables, this.parseData)
    expect(variables.has("AccumulatorCount:Behavior,SymbioteRange,Modification")).to.be.true
    const variable = variables.get("AccumulatorCount:Behavior,SymbioteRange,Modification")
    expect(variable.max).to.equal(20)
  })

  it("should be able to parse variables that refer to a token counter", function() {
    const variables = new Map()
    parseVariable("BehaviorStackCount:SymbioteRange", variables, this.parseData)
    expect(variables.has("BehaviorStackCount:SymbioteRange")).to.be.true
    const variable = variables.get("BehaviorStackCount:SymbioteRange")
    expect(variable.max).to.equal(20)
  })

  it("should add the variable information to variables with a new 'var' identifier", function() {
    const variables = new Map()
    parseVariable("BehaviorStackCount:SymbioteRange", variables, this.parseData)
    expect(variables.has("BehaviorStackCount:SymbioteRange")).to.be.true
    const variable = variables.get("BehaviorStackCount:SymbioteRange")
    expect(variable.name).to.equal('var0')
  })
})

describe("parseVariableReference", function() {
  describe("has accumulator reference", function() {
    beforeEach(function() {
      const elements = new Map([
        [
          'CBehavior',
          new Map([
            [
              'symbioterange',
              [
                {
                  ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                  Value: [
                    buildElement(null, { value: '60' })
                  ],
                  Modification: [
                    {
                      ...buildElement(),
                      AccumulatorArray: [
                        buildElement(null, { value: 'SymbioteAccumulator' })
                      ]
                    }
                  ]
                }
              ]
            ],
            [
              'symbiotenomin',
              [
                {
                  ...buildElement('CBehavior', { id: 'SymbioteNoMin' }),
                  Value: [
                    buildElement(null, { value: '60' })
                  ],
                  Modification: [
                    {
                      ...buildElement(),
                      AccumulatorArray: [
                        buildElement(null, { value: 'SymbioteNoMinAccumulator' })
                      ]
                    }
                  ]
                }
              ]
            ]
          ])
        ],
        [
          'CAccumulator',
          new Map([
            [
              'symbioteaccumulator',
              [
                {
                  ...buildElement('CAccumulator', { id: 'SymbioteAccumulator' }),
                  MinAccumulation: [
                    buildElement(null, { value: '5' })
                  ],
                  MaxAccumulation: [
                    buildElement(null, { value: '60' })
                  ],
                  Scale: [
                    buildElement(null, { value: '3' })
                  ],
                }
              ]
            ],
            [
              'symbiotenominaccumulator',
              [
                {
                  ...buildElement('CAccumulator', { id: 'SymbioteNoMinAccumulator' }),
                  MaxAccumulation: [
                    buildElement(null, { value: '60' })
                  ],
                  Scale: [
                    buildElement(null, { value: '3' })
                  ],
                }
              ]
            ]
          ])
        ]
      ])

      this.parseData = {
        elements,
        functions: {
          default: {
            merge: (parent: any[], child: any[]) => parent.concat(child)
          }
        }
      }
    })

    it("should set counter to the id of the element referenced", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.counter).to.eql('SymbioteRange')
    })

    it("should set min to the value in the Accumulator's 'MinAccumulation' field", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.min).to.equal(5)
    })

    it("should set min to zero if the accumulator doesn't have a 'MinAccumulation' field", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteNoMin', 'Modification', this.parseData)
      expect(variable.min).to.equal(0)
    })

    it("should set max to the value in the Accumulator's 'MaxAccumulation' field", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.max).to.equal(60)
    })

    it("should set scale to the value in the Accumulator's 'Scale' field", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.scale).to.equal(3)
    })
  })

  describe("does not have accumulator reference", function() {
    beforeEach(function() {
      const elements = new Map([
        [
          'CBehavior',
          new Map([
            [
              'symbioterange',
              [
                {
                  ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                  Value: [
                    buildElement(null, { value: '60' })
                  ],
                  Max: [
                    buildElement(null, { value: '20' })
                  ]
                }
              ]
            ],
          ])
        ],
      ])

      this.parseData = {
        elements,
        functions: {
          default: {
            merge: (parent: any[], child: any[]) => parent.concat(child)
          }
        }
      }
    })

    it("should set counter to the id of the element referenced", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.counter).to.equal('SymbioteRange')
    })

    it("should set min to zero", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.min).to.equal(0)
    })

    it("should set max to the value in 'Max' on the element", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.max).to.equal(20)
    })

    it("should set scale to one", function() {
      const variable = parseVariableReference('Behavior', 'SymbioteRange', 'Modification', this.parseData)
      expect(variable.scale).to.equal(1)
    })
  })
})

describe("parseVariableToken", function() {
  describe("has accumulator reference", function() {
    beforeEach(function() {
      const elements = new Map([
        [
          'CBehavior',
          new Map([
            [
              'symbioterange',
              [
                {
                  ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                  Value: [
                    buildElement(null, { value: '60' })
                  ],
                  StackCountAccumulator: [
                    buildElement(null, { value: 'SymbioteAccumulator' })
                  ]
                }
              ]
            ],
            [
              'symbiotenomin',
              [
                {
                  ...buildElement('CBehavior', { id: 'SymbioteNoMin' }),
                  Value: [
                    buildElement(null, { value: '60' })
                  ],
                  StackCountAccumulator: [
                    buildElement(null, { value: 'SymbioteNoMinAccumulator' })
                  ]
                }
              ]
            ]
          ])
        ],
        [
          'CAccumulator',
          new Map([
            [
              'symbioteaccumulator',
              [
                {
                  ...buildElement('CAccumulator', { id: 'SymbioteAccumulator' }),
                  MinAccumulation: [
                    buildElement(null, { value: '5' })
                  ],
                  MaxAccumulation: [
                    buildElement(null, { value: '60' })
                  ],
                  Scale: [
                    buildElement(null, { value: '3' })
                  ],
                }
              ]
            ],
            [
              'symbiotenominaccumulator',
              [
                {
                  ...buildElement('CAccumulator', { id: 'SymbioteNoMinAccumulator' }),
                  MaxAccumulation: [
                    buildElement(null, { value: '60' })
                  ],
                  Scale: [
                    buildElement(null, { value: '3' })
                  ],
                }
              ]
            ]
          ])
        ]
      ])

      this.parseData = {
        elements,
        functions: {
          default: {
            merge: (parent: any[], child: any[]) => parent.concat(child)
          }
        }
      }
    })

    it("should set counter to the id of the element referenced", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.counter).to.eql('SymbioteRange')
    })

    it("should set min to the value in the Accumulator's 'MinAccumulation' field", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.min).to.equal(5)
    })

    it("should set min to zero if the accumulator doesn't have a 'MinAccumulation' field", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteNoMin', this.parseData)
      expect(variable.min).to.equal(0)
    })

    it("should set max to the value in the Accumulator's 'MaxAccumulation' field", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.max).to.equal(60)
    })

    it("should set scale to the value in the Accumulator's 'Scale' field", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.scale).to.equal(3)
    })
  })

  describe("does not have accumulator reference", function() {
    beforeEach(function() {
      const elements = new Map([
        [
          'CBehavior',
          new Map([
            [
              'symbioterange',
              [
                {
                  ...buildElement('CBehavior', { id: 'SymbioteRange' }),
                  Value: [
                    buildElement(null, { value: '60' })
                  ],
                  Max: [
                    buildElement(null, { value: '20' })
                  ]
                }
              ]
            ],
          ])
        ],
      ])

      this.parseData = {
        elements,
        functions: {
          default: {
            merge: (parent: any[], child: any[]) => parent.concat(child)
          }
        }
      }
    })

    it("should set counter to the id of the element referenced", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.counter).to.equal('SymbioteRange')
    })

    it("should set min to zero", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.min).to.equal(0)
    })

    it("should set max to the value in 'Max' on the element", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.max).to.equal(20)
    })

    it("should set scale to one", function() {
      const variable = parseVariableToken("BehaviorStackCount", 'SymbioteRange', this.parseData)
      expect(variable.scale).to.equal(1)
    })
  })
})

describe("parseReference", function() {
  beforeEach(function() {
    this.element = buildElement('tooltip', {
      'value': {
        "enus": "Increases the range of Symbiote's Spike Burst by <c val=\"#TooltipNumbers\"><d ref=\"\" player=\"0\"/>%</c> and decreases the cooldown by <c val=\"#TooltipNumbers\"><d ref=\"-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value\" player=\"0\"/></c> second."
      }
    })

    this.reference = "Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value"
    this.references = new Map()
    this.result = parseReference(this.reference, this.references)
    this.ref0 = this.references.get(this.reference)
  })

  it("should add the reference information to the references Map", function() {
    expect(this.references.has(this.reference)).to.be.true
  })

  it("should set the reference name in the reference data", function() {
    expect(this.ref0).to.have.property('name').and.equal('ref0')
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
