import { expect } from 'chai'
import { spy } from 'sinon'

import { ELEMENT_ATTRIBUTE_KEY } from '../../src/element'
import { ElementMap } from '../../src/element-map'
import { parseElement } from '../../src/parsers'

describe("parseElement", function() {
  beforeEach(function() {
    this.parseData = {
      elements: new Map([
        ['hero', new Map([
          ['', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '1' }, testElement: [ {} ] } as any ] ],
          ['test', [ { [ELEMENT_ATTRIBUTE_KEY]: { tier: '5', value: 'text', id: 'test' }, testElement2: [ {} ] } as any ] ]
        ])]
      ]) as ElementMap,
      text: new Map(),
      functions: {
        'default': {
          "merge": (parentElements: any[], childElements: any[]) => parentElements.concat(childElements)
        },
        'hero': {
          "process": (element: any): any => element
        },
        'testElement': {
          "process": (element: any): any => element
        },
      },
      options: { xmlSearchPatterns: [] as any[], textSearchPatterns: [] as any[], functions: {}, locales: [] as any[] }
    }
  })

  it("should merge the element with it's parent elements", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(parsedElement).to.eql({
      [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', tier: '1', value: 'thing' },
      testElement: [ { [ELEMENT_ATTRIBUTE_KEY]: {} }, { [ELEMENT_ATTRIBUTE_KEY]: {} } ]
    })
  })

  it("should call the 'process' function on the element", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const processSpy = spy(this.parseData.functions.hero, 'process')
    const parsedElement = parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.called
  })

  it("should call process on all of the elements inner elements", function() {
    const element = { [ELEMENT_ATTRIBUTE_KEY]: { id: 'test', value: 'thing' }, testElement: [ {} ] }

    const processSpy = spy(this.parseData.functions.testElement, 'process')
    const parsedElement =  parseElement(element, null, 'hero', this.parseData)

    expect(processSpy).to.have.been.calledTwice
  })
})
