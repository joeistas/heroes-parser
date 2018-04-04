import { ElementFunctions } from './element'
import { parse, ParseData } from './parser'
import { replaceElement } from './processors'
import { inspect } from 'util'

parse("/mnt/c/Program Files (x86)/Heroes of the Storm")
  .then(heroes => {
    console.log(heroes.map(h => h.$.id))
    const hero: any = heroes.find(h => h.$.id === 'Abathur')

    // console.log(inspect(hero, false, null))
  })
  .catch(e => console.log(e))
