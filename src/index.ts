import { ElementFunctions } from './element'
import { parse } from './parser'
import { ParseData } from "./parse-data"

parse({ sourceDir: "/mnt/c/Program Files (x86)/Heroes of the Storm", saveSourceFiles: true, saveJSON: true, archiveJSON: false, archiveSourceFiles: false })
  .catch(e => console.log(e))
