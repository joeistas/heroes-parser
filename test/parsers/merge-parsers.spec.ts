import { expect } from 'chai'
import * as sinon from 'sinon'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY } from '../../src/element'
import { mergeElement } from '../../src/parsers/merge-parsers'

describe("mergeElement", function() {
  const parseData: any = {
    functions: {
      default: {
        merge: (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
      }
    },
    elements: new Map(
      [
        [
          'Hero',
          new Map([
            [
              'Muradin',
              [
                {
                  [ELEMENT_ATTRIBUTE_KEY]: {
                    id: "Muradin",
                    role: "Tank",
                  }
                }
              ]
            ],
            [
              'LiMing',
              [
                {
                  [ELEMENT_ATTRIBUTE_KEY]: {
                    id: "LiMing",
                    role: "Assassin",
                  }
                }
              ]
            ]
          ])
        ],
        [
          'Skin',
          new Map([
            [
              'MuratinUltimate',
              [
                {
                  [ELEMENT_ATTRIBUTE_KEY]: {
                    id: "MuratinUltimate",
                  }
                }
              ]
            ]
          ])
        ],
      ]
    )
  }

  it("should not merge the element if attribute is undefined", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'thing',
        test: undefined,
      }
    }

    const result = mergeElement('Hero', 'test')(element, {}, {} as any)
    expect(result).to.eql(element)
  })

  it("should not merge the element if a matching element cannot be found in the ElementMap", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'Varian',
      }
    }

    const result = mergeElement('Hero', 'value')(element, {}, parseData)
    expect(result).to.eql(element)
  })

  it("should merge the element if elementNameOrFilter is a string", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'Muradin',
      },
      Flags: [
        {
          index: 'test',
          value: 'value'
        }
      ]
    }

    const result = mergeElement('Hero', 'value')(element, {}, parseData)
    expect(result).to.eql(
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          id: 'Muradin',
          role: 'Tank',
        },
        [ELEMENT_NAME_KEY]: 'Hero',
        Flags: [
          {
            index: 'test',
            value: 'value'
          }
        ]
      }
    )
  })

  it("should merge the element if elementNameOrFilter is an ElementNameFilter", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'Muradin',
      },
      Flags: [
        {
          index: 'test',
          value: 'value'
        }
      ]
    }

    const result = mergeElement(() => [ 'Hero', 'Skin' ], 'value')(element, {}, parseData)
    expect(result).to.eql(
      {
        [ELEMENT_ATTRIBUTE_KEY]: {
          id: 'Muradin',
          role: 'Tank',
        },
        [ELEMENT_NAME_KEY]: 'Hero',
        Flags: [
          {
            index: 'test',
            value: 'value'
          }
        ]
      }
    )
  })

  it("should call 'preParse' on the new merged element", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'Muradin',
      },
    }

    const data = {
      ...parseData,
      functions: {
        ...parseData.functions,
        'Hero': {
          preParse: sinon.spy()
        }
      }
    }

    mergeElement('Hero', 'value')(element, {}, data)
    expect(data.functions.Hero.preParse).to.have.been.called
  })

  it("should set 'elementName' to the merged element's name", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'Muradin',
      },
    }

    const result = mergeElement('Hero', 'value')(element, {}, parseData)
    expect(result).to.have.property(ELEMENT_NAME_KEY).that.is.eql('Hero')
  })

  it("should remove 'attribute' from the result", function() {
    const element: any = {
      [ELEMENT_ATTRIBUTE_KEY]: {
        value: 'Muradin',
      },
    }

    const result = mergeElement('Hero', 'value')(element, {}, parseData)
    expect(result[ELEMENT_ATTRIBUTE_KEY]).to.not.have.property('value')
  })
})
