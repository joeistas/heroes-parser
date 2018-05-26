import { expect } from 'chai'
import { spy } from 'sinon'

import { ELEMENT_ATTRIBUTE_KEY, ELEMENT_NAME_KEY } from '../../src/element'
import { ElementMap } from '../../src/element-map'
import { parseElement } from '../../src/parsers'
import { mergeElement } from '../../src/parsers/merge-parsers'

describe("parseElement", function() {
  beforeEach(function() {
    this.parseData = {
      elements: new Map([
        ['hero', new Map([
          ['', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner' }, } ] } as any ] ],
          ['test', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' }, testElement2: [ {} ] } as any ] ]
        ])]
      ]) as ElementMap,
      text: new Map(),
      functions: {
        'default': {
          "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
        },
        'hero': {
          "preParse": (element: any): any => element,
          "postParse": (element: any): any => element,
        },
        "change": {
          "preParse": (element: any): any => {
            element[ELEMENT_ATTRIBUTE_KEY].addition = 'thing'
            return element
          },
        },
        'testElement': {
          "preParse": (element: any): any => element,
          "postParse": (element: any): any => element,
        },
      },
      options: { xmlSearchPatterns: [] as any[], textSearchPatterns: [] as any[], functions: {}, locales: [] as any[] }
    }
  })

  it("should merge the element with it's parent elements", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' },
      testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner2' }, } ]
    }

    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(parsedElement).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '1', value: 'thing' },
      [ELEMENT_NAME_KEY]: 'hero',
      testElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner' },
          [ELEMENT_NAME_KEY]: 'testElement'
        }, {
          [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner2', },
          [ELEMENT_NAME_KEY]: 'testElement'
        }
      ]
    })
  })

  it("should call the 'preParse' function on the element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' },
      testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner2' }, } ]
    }

    const processSpy = spy(this.parseData.functions.hero, 'preParse')
    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.called
  })

  it("should call the 'preParse' function with a context that contains the attributes of the element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' },
      testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner2' }, } ]
    }

    const processSpy = spy(this.parseData.functions.hero, 'preParse')
    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(processSpy.args[0][3]).to.eql({ attributes: { id: 'test', value: 'thing' } })
  })

  it("should call 'preParse' on all of the element's inner elements", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const processSpy = spy(this.parseData.functions.testElement, 'preParse')
    const parsedElement =  parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.calledTwice
  })

  it("should call 'preParse' on all of the element's inner elements with a context containing the outer and inner attributes merged", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' },
      testElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: { value: "otherThing", another: "value" }
        }
      ]
    }

    const processSpy = spy(this.parseData.functions.testElement, 'preParse')
    const parsedElement =  parseElement(element, null, 'hero', this.parseData)

    expect(processSpy.args[1][3]).to.eql({ attributes: { value: "otherThing", another: "value", id: "test", tier: '1' } })
  })

  it("should call 'preParse' on inner elements with an updated context if the attributes of the outer element where changed during 'preParse'", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' },
      testElement: [
        {
          [ELEMENT_ATTRIBUTE_KEY]: { value: "otherThing", another: "value" }
        }
      ]
    }

    const processSpy = spy(this.parseData.functions.testElement, 'preParse')
    const parsedElement =  parseElement(element, null, 'change', this.parseData)

    expect(processSpy.args[0][3]).to.eql({ attributes: { value: "otherThing", another: "value", id: "test", addition: "thing" } })
  })

  it("should call the 'postParse' function on the element", function() {
    const element = {
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' },
      [ELEMENT_NAME_KEY]: 'hero',
      testElement: [ {} ]
    }

    const processSpy = spy(this.parseData.functions.hero, 'postParse')
    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.called
  })

  it("should call 'postParse' on all of the elements inner elements", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const processSpy = spy(this.parseData.functions.testElement, 'postParse')
    const parsedElement =  parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.calledTwice
  })

  it("should not process an element already seen in the current branch", function(done) {
    const parseData: any = {
      elements: new Map([
        [
          'hero',
          new Map([
            [
              '',
              [
                { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: { id: 'inner' }, } ] } as any ] ],
            [
              'test',
              [
                {
                  [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' },
                  testElement2: [
                    {
                      [ELEMENT_ATTRIBUTE_KEY]: {
                        value: 'test'
                      }
                    }
                  ]
                } as any
              ]
            ]
          ])
        ]
      ]) as ElementMap,
      functions: {
        'default': {
          "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
        },
        'testElement': {
          "preParse": mergeElement('hero'),
        },
      }
    }

    const element = parseData.elements.get('hero').get('test')[0]
    const parsedElement = parseElement(element, null, 'hero', this.parseData)
    expect(parsedElement.testElement2[0][ELEMENT_ATTRIBUTE_KEY]).to.have.keys('value')
    done()
  })
})
