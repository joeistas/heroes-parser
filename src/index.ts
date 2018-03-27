import * as casclib from 'casclib'
import * as xml2js from 'xml2js'
import * as util from 'util'

import { ElementFunctions } from './element'
import { parse, ParseData } from './parser'
import { replaceElement } from './processors'
const elementFunctions: { [elementName: string]: ElementFunctions } = {
  'default': {
    merge: function(parentElements: any[], childElements: any[], mergedAttributes: any): any[] {
      const elements = [ ...parentElements, ...childElements ]
      const indexedElements = elements.filter(e => e['$'] && !!e['$'].index)
      const unindexed = elements.filter(e => !e['$'] || !e['$'].index)

      return unindexed.concat([ ...new Map(indexedElements.map(e => [e.$.index, e]) as [string, any][]).values() ])
    },
  },
  'TalentTreeArray': {
    process: replaceElement("CTalent", 'Talent')
  },
}

const options = {
  xmlSearchPatterns: [
    "mods/heroesdata.stormmod/base.stormdata/GameData/HeroData.xml",
    "mods/heroesdata.stormmod/base.stormdata/GameData/Heroes/*Data.xml",
    "mods/heromods/*.stormmod/base.stormdata/GameData/*.xml",
  ],
  textSearchPatterns: [
    "mods/heroesdata.stormmod/*/LocalizedData/*.txt",
    "mods/heromods/*/LocalizedData/*.txt",
  ],
  locales: [] as string[],
  functions: elementFunctions,
}

parse("/mnt/c/Program Files (x86)/Heroes of the Storm", options)
