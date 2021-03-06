import { expect } from 'chai'
import * as sinon from 'sinon'
import * as cheerio from 'cheerio'

import { buildElement } from '../src/element'
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
  computeTooltipDataFormulas,
  renderTooltipData,
  convertFormulaToStandardPrecedence
} from '../src/tooltip'
import { ParseData } from '../src/parse-data'
import { buildLogger } from '../src/logger'

describe("parseTooltipLocaleText", function() {
  const localeText = {
    "enus": "Increases the range of Symbiote's Spike Burst by <c val=\"#TooltipNumbers\"><d ref=\"(Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray[0].Radius*100)\" player=\"0\"/>%</c> and decreases the cooldown by <c val=\"#TooltipNumbers\"><d ref=\"-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[4].Value\" player=\"0\"/></c> second."
  }

  const parseData = {
    elements: new Map()
  } as ParseData

  it("should call 'templateElement' function for every 'c' element in the tooltip text", function() {
    const templateSpy = sinon.spy(toSpanElement)
    parseTooltipLocaleText(localeText, parseData, handleBarsTemplateReplacement, templateSpy)
    expect(templateSpy).to.have.been.calledTwice
  })

  it("should call 'formulaElement' function for every 'd' element in the tooltip text", function() {
    const formulaSpy = sinon.spy(handleBarsTemplateReplacement)
    parseTooltipLocaleText(localeText, parseData, formulaSpy)
    expect(formulaSpy).to.have.been.calledTwice
  })

  it("should replace every 'c' element with the result of 'templateElement' function", function() {
    const result = parseTooltipLocaleText(localeText, parseData)
    const $ = cheerio.load(result.localeText.enus)
    expect($('span')).to.have.length(2)
  })

  it("should replace every 'd' element with the result of 'formulaElement' function", function() {
    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.match(/{{ formula0 }}/)
    expect(result.localeText.enus).to.match(/{{ formula1 }}/)
  })

  it("should replace every 'n' element with <br />", function() {
    const localeText = {
      "enus": "Increases <n/><n>stuff <c>things</c><n/>"
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.eql("Increases <br /><br />stuff <span>things</span><br />")
  })

  it("should correct malformed 'n' elements", function() {
    const localeText = {
      "enus": "Increases </n></n>stuff <c>things</c></n>"
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.eql("Increases <br /><br />stuff <span>things</span><br />")
  })

  it("should set a formula for every 'd' element in the tooltip text", function() {
    const result = parseTooltipLocaleText(localeText, parseData)
    const formulas = result.formulas
    expect(Object.keys(formulas)).to.have.length(2)
  })

  it("every formula value should be pulled from the 'd' element 'ref' attribute", function() {
    const result = parseTooltipLocaleText(localeText, parseData)
    const formulas = result.formulas

    expect(formulas.formula0.formula).to.equal("(ref0/ref1*100)")
    expect(formulas.formula1.formula).to.equal("-ref2")
  })

  it("should not convert unicode characters to html entities", function() {
    const localeText = {
      "enus": "대지파괴자"
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.eql("대지파괴자")
  })

  it("should preserve html entities", function() {
    const localeText = {
      "enus": "&amp; &lt;"
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.eql("&amp; &lt;")
  })

  it("should maintain the correct formula values over multiple formulas and locales", function() {
    const localeText = {
      "enus": "<c><d ref='Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray' /></c><c><d ref='-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray' /></c>",
      "frfr": "<c><d ref='-Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray' /></c><c><d ref='Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray' /></c>",
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.equal("<span>{{ formula0 }}</span><span>{{ formula1 }}</span>")
    expect(result.localeText.frfr).to.equal("<span>{{ formula1 }}</span><span>{{ formula0 }}</span>")
    expect(result.formulas.formula0.formula).to.eql("ref0/ref1")
    expect(result.formulas.formula1.formula).to.equal("-ref0")
  })

  it("should not remove '%' characters inside 'c' elements", function() {
    const localeText = {
      "enus": "<c><d ref='Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray' />%</c>",
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.equal("<span>{{ formula0 }}%</span>")
  })

  it("should not remove non element text inside 'c' elements", function() {
    const localeText = {
      "enus": "<c><d ref='Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray' /> text</c>",
    }

    const result = parseTooltipLocaleText(localeText, parseData)
    expect(result.localeText.enus).to.equal("<span>{{ formula0 }} text</span>")
  })

  it("should set precision for a formula to zero if the attribute is not set on the 'd' element", function() {
    const localeText = {
      "enus": "<c><d ref='Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray' />%</c>",
    }

    const result = parseTooltipLocaleText(localeText, parseData)

    expect(result.formulas.formula0.precision).to.equal(0)
  })

  it("should set precision for a formula to the value of the precision attribute is set on the 'd' element", function() {
    const localeText = {
      "enus": "<c><d ref='Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray/Effect,AbathurSymbioteSpikeBurstDamageSearch,AreaArray' precision='2' />%</c>",
    }

    const result = parseTooltipLocaleText(localeText, parseData)

    expect(result.formulas.formula0.precision).to.equal(2)
  })
})

describe("computeTooltipDataFormulas", function() {
  buildLogger()

  it("should compute the value of each formula and place the result in 'formulaResults'", function() {
    const tooltipData = {
      localeText: {},
      formulas: {
        formula0: { formula: "20 - 4 / 2", precision: 0 }
      },
      references: {},
      variables: {}
    }

    const result = computeTooltipDataFormulas(tooltipData)
    expect(result.formulas.formula0).to.have.property("result").and.to.equal("18")
  })

  it("should replace references with the value in the TooltipReference data", function() {
    const tooltipData = {
      localeText: {},
      formulas: {
        formula0: {
          formula: "20 - ref0 / 2",
          precision: 0
        }
      },
      references: {
        ref0: {
          catalog: '',
          entry: '',
          field: '',
          value: 12
        }
      },
      variables: {}
    }

    const result = computeTooltipDataFormulas(tooltipData)
    expect(result.formulas.formula0).to.have.property("result").and.to.equal("14")
  })

  it("should set formulaResult to 'NaN' if a reference value is null or undefined", function() {
    const tooltipData: Partial<TooltipData> = {
      localeText: {},
      formulas: {
        formula0: {
          formula: "20 - ref0 / 2",
          precision: 0,
        }
      },
      references: {
        ref0: {
          catalog: '',
          entry: '',
          field: '',
          value: null,
        }
      },
      variables: {}
    }

    const result = computeTooltipDataFormulas(tooltipData)
    expect(result.formulas.formula0).to.have.property("result").and.to.equal('NaN')
  })

  it("should set formulaResult to 'NaN' if the formula is invalid", function() {
    const tooltipData: Partial<TooltipData> = {
      localeText: {},
      formulas: {
        formula0: {
          formula: "20 - ref0 /",
          precision: 0
        }
      },
      references: {
        ref0: {
          catalog: '',
          entry: '',
          field: '',
          value: 12,
        }
      },
      variables: {}
    }

    const result = computeTooltipDataFormulas(tooltipData)
    expect(result.formulas.formula0).to.have.property("result").and.to.equal('NaN')
  })

  it("should default a variable to it's min value if it is not set in variableValues", function() {
    const tooltipData = {
      localeText: {},
      formulas: {
        formula0: {
          formula: "0 + var0 * 2",
          precision: 0,
        }
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

    const result = computeTooltipDataFormulas(tooltipData)
    expect(result.formulas.formula0).to.have.property("result").and.to.equal("10")
  })

  it("should set a variable to the value set in variableValues", function() {
    const tooltipData = {
      localeText: {},
      formulas: {
        formula0: {
          formula: "0 + var0 * 2",
          precision: 0,
        }
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

    const result = computeTooltipDataFormulas(tooltipData, { var0: 35 })
    expect(result.formulas.formula0).to.have.property("result").and.to.equal("70")
  })

  it("should round the result to the number of decimal places specifed in the formula 'precision' field", function() {
    const tooltipData: Partial<TooltipData> = {
      localeText: {},
      formulas: {
        formula0: {
          formula: "18.24567 - ref0 / 2",
          precision: 3
        }
      },
      references: {
        ref0: {
          catalog: '',
          entry: '',
          field: '',
          value: 12,
        }
      },
      variables: {}
    }

    const result = computeTooltipDataFormulas(tooltipData, {})
    expect(result.formulas.formula0.result).to.equal("12.246")
  })
})

describe("renderTooltipData", function() {
  it("should return an empty object if 'tooltipData' is empty", function() {
    const result = renderTooltipData({} as TooltipData)
    expect(result).to.eql({})
  })

  it("should return render a tooltip if there are no formulas", function() {
    const result = renderTooltipData({ localeText: { enus: "This is a tooltip!" } } as any)
    expect(result).to.eql({ enus: "This is a tooltip!" })
  })

  it("should call 'render'", function() {
    const tooltipData = {
      localeText: {
        enus: "Increases the range of Symbiote's Spike Burst"
      },
      formulas: {},
      formulaResults: {},
      references: {},
      variables: {},
    }

    const renderSpy = sinon.spy(renderTooltipWithHandlebars)

    renderTooltipData(tooltipData, renderSpy)

    expect(renderSpy).to.have.been.calledOnce
  })

  it("should not convert unicode characters to html entities", function() {
    const tooltipData = {
      localeText: {
        enus: "대지파괴자"
      },
      formulas: {},
      references: {},
      variables: {},
    }

    const result = renderTooltipData(tooltipData)
    expect(result.enus).to.eql("대지파괴자")
  })

  it("should preserve html entities", function() {
    const tooltipData = {
      localeText: {
        enus: "&amp; &lt;"
      },
      formulas: {},
      references: {},
      variables: {},
    }

    const result = renderTooltipData(tooltipData)
    expect(result.enus).to.eql("&amp; &lt;")
  })

  it("should replace any formula references with the correct value in 'formulaResults'", function() {
    const tooltipData = {
      localeText: {
        enus: "Start text {{ formula0 }} some text {{ formula1 }}"
      },
      formulas: {
        formula0: {
          formula: '',
          precision: 0,
          result: "12"
        },
        formula1: {
          formula: '',
          precision: 0,
          result: '4%'
        },
      },
      references: {},
      variables: {},
    }

    const result = renderTooltipData(tooltipData)
    expect(result.enus).to.eql("Start text 12 some text 4%")
  })
})

describe("parseFormula", function() {
  const parseData = {
    elements: new Map()
  } as ParseData

  it("should return '0' if formula is not defined", function() {
    const result = parseFormula(undefined, new Map(), new Map(), parseData)
    expect(result).to.equal('0')
  })

  it("should convert sequences that begin with a capital letter and contain letters and '.,[]:' characters to a reference", function() {
    const formula = "Effect,RaynorAdrenalineRushHealer,RechargeVitalRate.Value[0]"
    const references = new Map()

    parseFormula(formula, references, new Map(), parseData)
    expect(references.has("Effect,RaynorAdrenalineRushHealer,RechargeVitalRate.Value[0]")).to.be.true
  })

  it("should replace references with 'ref' identifiers", function() {
    const formula = "Effect,RaynorAdrenalineRushHealer,RechargeVitalRate.Value[0]"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("ref0")
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
    expect(result).to.eql("var0")
  })

  it("should handle sub d elements ([d ref='' ]) in the tooltip text", function() {
    const formula = `Effect,RaynorAdrenalineRushHealer,RechargeVitalRate * [d ref='Effect,RaynorAdrenalineRushPersistent,PeriodCount' player='0'/]`
    const references = new Map()

    const result = parseFormula(formula, references, new Map(), parseData)
    expect(result).to.not.be.null
    expect(result).to.equal("ref0 * ref1")
    expect(references.has('Effect,RaynorAdrenalineRushPersistent,PeriodCount')).to.be.true
    expect(references.get('Effect,RaynorAdrenalineRushPersistent,PeriodCount')).to.eql({
      catalog: "Effect",
      entry: "RaynorAdrenalineRushPersistent",
      field: "PeriodCount",
      name: 'ref1',
      value: 0,
    })
  })

  it("should remove unmatched open parentheses", function() {
    const formula = "(100 * ((30 + 2)"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("100 * (30 + 2)")
  })

  it("should remove unmatched close parentheses", function() {
    const formula = "(30 + 2)) * 100)"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("(30 + 2) * 100")
  })

  it("should remove trailing '/' operators", function() {
    const formula = "30 * 100/"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("30 * 100")
  })

  it("should remove trailing '*' operators", function() {
    const formula = "30 * 100*"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("30 * 100")
  })

  it("should remove trailing '-' operators", function() {
    const formula = "30 * 100-"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("30 * 100")
  })

  it("should remove trailing '+' operators", function() {
    const formula = "30 * 100+"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("30 * 100")
  })

  it("should add parentheses so the formula works with standard precedence rules", function() {
    const formula = "30 + 5 / 6"
    const result = parseFormula(formula, new Map(), new Map(), parseData)
    expect(result).to.eql("(30 + 5 )/ 6")
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
    this.elements = new Map([
      [
        'CTalent',
        new Map([
          [
            'abathurmasterypressurizedglands',
            [
              {
                ...buildElement('CTalent', { id: 'AbathurMasteryPressurizedGlands' }),
                AbilityModificationArray: [
                  {
                    ...buildElement(),
                    Modifications: [
                      {
                        ...buildElement(),
                        Value: buildElement(null, { value: '60.6' })
                      }
                    ]
                  }
                ]
              }
            ]
          ]
        ])
      ]
    ])

    this.functions = {
      default: {
        merge: (parent: any[], child: any[]) => parent.concat(child)
      }
    }

    this.reference = "Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Modifications[0].Value"
    this.references = new Map()
    parseReference(this.reference, this.references, { elements: this.elements, functions: this.functions } as any)
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

  it("should set the value of the reference in 'value'", function() {
    expect(this.ref0).to.have.property('value')
  })

  it("should set value set for the reference should be a number", function() {
    expect(this.ref0.value).to.equal(60.6)
  })

  it("should replace all '[' characters with a period from 'field'", function() {
    expect(this.ref0.field).to.match(/AbilityModificationArray\./)
  })

  it("should remove all ']' characters from 'field'", function() {
    expect(this.ref0.field).to.not.match(/\]/)
  })

  it("should set value to 0 for references that are not found", function() {
    const reference = "Talent,AbathurMasteryPressurizedGlands,AbilityModificationArray[0].Value"
    const references = new Map()

    parseReference(reference, references, { elements: this.elements, functions: this.functions } as any)
    expect(references.get(reference).value).to.equal(0)
  })
})

describe("convertFormulaToStandardPrecedence", function() {
  it("should return the original formula if there are no operators and parentheses in the formula", function() {
    const formula = "30"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should return the original formula if there is only a single operator", function() {
    const formula = "30 + 5"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should not add a set of parentheses if two operators in order have the same precedence", function() {
    const formula = "30 + 5 + 4"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should add a set of parentheses starting at the beginning of the formula and at the opererator where it's precedence is different than the previous operator", function() {
    const formula = "30 + 5 * 4"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql("(30 + 5 )* 4")
  })

  it("should add a set of parentheses if two operators of different precedence are within the same set of parentheses", function() {
    const formula = "30 + (5 * 4 + 2)"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql("30 + ((5 * 4 )+ 2)")
  })

  it("should consider a minus sign an unary operator if it is at the start of the formula", function() {
    const formula = "-30 * 5"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should consider a minus sign an unary operator if it is preceded by a operator", function() {
    let formula = "30*-5"
    let result = convertFormulaToStandardPrecedence(formula)
    expect(result).to.eql(formula)

    formula = "30+-5"
    result = convertFormulaToStandardPrecedence(formula)
    expect(result).to.eql(formula)

    formula = "30/-5"
    result = convertFormulaToStandardPrecedence(formula)
    expect(result).to.eql(formula)

    formula = "30--5"
    result = convertFormulaToStandardPrecedence(formula)
    expect(result).to.eql(formula)
  })

  it("should consider a minus sign an unary operator if it is preceded by a operator with whitespace in between", function() {
    const formula = "30*  \t-5"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should consider a '+' and '-' the same precedence", function() {
    const formula = "30 + 5 - 4"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should consider a '*' and '/' the same precedence", function() {
    const formula = "30 / 5 * 4"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql(formula)
  })

  it("should concider a '+' or '-' a different precedence than '*' or '/'", function() {
    const formula = "30 + 5 / 4"

    const result = convertFormulaToStandardPrecedence(formula)

    expect(result).to.eql("(30 + 5 )/ 4")
  })
})
