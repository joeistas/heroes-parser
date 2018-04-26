import { expect } from 'chai'
import * as sinon from 'sinon'

import { ELEMENT_NAME_KEY, ELEMENT_ATTRIBUTE_KEY } from '../../src/element'
import { processAsset } from '../../src/parsers/asset-parsers'

describe("processAsset", function() {
  describe("attribute is not an asset", function() {
    it("attribute value is not set", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': 'value',
        }
      }

      const result = processAsset('value')(element, {}, {} as any, {})
      expect(result).to.eql(element)
    })

    it("attribute value is null", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': null
        }
      }

      const result = processAsset('test')(element, {}, {} as any, {})
      expect(result).to.eql(element)
    })

    it("attribute value is undefined", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': undefined
        }
      }

      const result = processAsset('test')(element, {}, {} as any, {})
      expect(result).to.eql(element)
    })

    it("attribute value is not a string", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': 34
        }
      }

      const result = processAsset('test')(element, {}, {} as any, {})
      expect(result).to.eql(element)
    })

    it("attribute value is an empty string", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': ""
        }
      }

      const result = processAsset('test')(element, {}, {} as any, {})
      expect(result).to.eql(element)
    })
  })

  describe("fetching asset results from asset cache", function() {
    const parseData: any = {
      assets: [] as string[],
      assetfindCache: new Map([
        [ 'test/path', ['thing', 'anotherthing'] ],
        [ 'another/path', ['thing', 'something'] ],
        [ 'path', ['thing', 'something'] ],
      ])
    }

    it("asset value has forward slashes", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "test/path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql(['thing', 'anotherthing'])
    })

    it("asset value has back slashes", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "test\\path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql(['thing', 'anotherthing'])
    })

    it("asset value mixed case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "pAth"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql(['thing', 'something'])
    })

    it("asset value is lower case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql(['thing', 'something'])
    })
  })

  describe("finding asset names in asset list", function() {
    const parseData: any = {
      assets: [
        'test/path',
        'another/path',
        'Another/Thing/Here',
      ],
      assetfindCache: new Map()
    }

    it("asset value has forward slashes", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "test/path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql([ 'test/path' ])
    })
    it("asset value has back slashes", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "test\\path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql([ 'test/path' ])
    })

    it("asset value mixed case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "pAth"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql([ 'test/path', 'another/path' ])
    })

    it("asset value is lower case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql([ 'test/path', 'another/path' ])
    })

    it("file path is mixed case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "another"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql([ 'another/path', 'Another/Thing/Here' ])
    })

    it("file path is lower case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "test/path"
        }
      }

      const result = processAsset('test')(element, {}, parseData, {})
      expect(result[ELEMENT_ATTRIBUTE_KEY].test).to.eql([ 'test/path' ])
    })
  })

  describe("setting values in cache", function() {
    beforeEach(function() {
      this.parseData = {
        assets: [
          'test/path',
          'another/path',
          'Another/Thing/Here',
        ],
        assetfindCache: new Map()
      }
    })

    it("should add search results to find cache", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "test/path"
        }
      }

      processAsset('test')(element, {}, this.parseData, {})
      expect(this.parseData.assetfindCache.size).to.equal(1)
      expect(this.parseData.assetfindCache).to.have.keys('test/path')
      expect(this.parseData.assetfindCache.get('test/path')).to.have.eql([ 'test/path' ])
    })

    it("should normailze keys by changing forward slashes to back slashes and converting to lower case", function() {
      const element: any = {
        [ELEMENT_ATTRIBUTE_KEY]: {
          'test': "Test\\Path"
        }
      }

      processAsset('test')(element, {}, this.parseData, {})
      expect(this.parseData.assetfindCache.size).to.equal(1)
      expect(this.parseData.assetfindCache).to.have.keys('test/path')
    })
  })
})
