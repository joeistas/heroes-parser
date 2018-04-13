import { ElementFunctions } from './element'
import { parse, ParseData } from './parser'
import { inspect } from 'util'

parse("/mnt/c/Program Files (x86)/Heroes of the Storm", { saveSourceFiles: true, saveJSON: true, archiveJSON: false, archiveSourceFiles: false })
  .catch(e => console.log(e))
