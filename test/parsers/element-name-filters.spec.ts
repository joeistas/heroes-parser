import { expect } from 'chai'
import * as sinon from 'sinon'

import { startsWith, inList } from '../../src/parsers/element-name-filters'

it("startsWith returns element names in the ElementMap that start with 'startsWith'", function() {
  const parseData: any = {
    elements: new Map([
      [ 'test', [] ],
      [ 'thing', [] ],
      [ 'element', [] ],
      [ 'elementArray', [] ],
      [ 'longelementArray', [] ],
    ])
  }

  const result = startsWith('element')(parseData)
  expect(result).to.eql([ 'element', 'elementArray' ])
})

it("inList returns 'list'", function() {
  expect(inList('first', 'next')({} as any)).to.eql([ 'first', 'next' ])
})
