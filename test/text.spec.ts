import { expect } from 'chai'

import { buildTextMap, addTextToTextMap, localeFromFilePath } from "../src/text"

describe("buildTextMap", function() {
  it("should build a text map with all of the text entries from the fileData added to the map", function() {
    const fileData = [
      [ "/enus.stormdata/", "thing=fish\r\nanother=entry\r\nlast=something" ],
      [ "/dede.stormdata/", "frost=chill\r\nrun=fast\r\n" ],
    ] as [string, string][]

    const textMap = buildTextMap(fileData)

    expect(textMap).to.have.all.keys('enus', 'dede')
    expect(textMap.get('enus')).to.have.all.keys('thing', 'another', 'last')
    expect(textMap.get('dede')).to.have.all.keys('frost', 'run')
  })
})

describe("addTextToTextMap", function() {
  it("should convert the text file to entries and add them to the correct locale in the text map", function() {
    const text = "thing=fish\r\nanother=entry\r\nlast=something"
    const textMap = new Map()

    addTextToTextMap(text, 'enus', textMap)

    expect(textMap).to.have.all.keys('enus')

    const enus = textMap.get('enus')
    expect(enus).to.have.all.keys('thing', 'another', 'last')

    expect(enus.get('thing')).to.equal('fish')
    expect(enus.get('another')).to.equal('entry')
    expect(enus.get('last')).to.equal('something')
  })

  it("should return the correct key and text when a '=' character is in the text", function() {
    const text = "thing=fish\r\nanother=entry thing=fish\r\nlast=something"
    const textMap = new Map()

    expect.fail()
  })
})

describe("localeFromFilePath", function() {
  it("should get the locale from the file path", function() {
    const locale = localeFromFilePath("mods/heroesdata.stormmod/ruru.stormdata/LocalizedData/thing.txt")
    expect(locale).to.equal("ruru")
  })

  it("should return 'enus' if the locale cannot be found", function() {
    const locale = localeFromFilePath("mods/heroesdata.stormmod/base.stormassets/thing.txt")
    expect(locale).to.equal("enus")
  })

  it("should return 'enus' of the locale is 'base'", function() {
    const locale = localeFromFilePath("mods/heroesdata.stormmod/base.stormdata/LocalizedData/thing.txt")
    expect(locale).to.equal("enus")
  })
})
