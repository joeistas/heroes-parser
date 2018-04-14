#!/usr/bin/env node

import *  as program from 'commander'
import { ParseOptions } from '../parse-options'
import { DETAILED_FUNCTIONS } from '../element-functions/detailed'
import { parse } from '../parser'
program
  .description("Generate JSON from Heroes of the Storm data")
  .option("--out <dir>, --out-dir <dir>", "Directory to save JSON and source files")
  .option("--no-game-dir", "Source directory is not the Heroes of the Storm install directory")
  .option("--build-number <number>", "Build number to use if the soruce is not a game directory")
  .option("--root-element <element-name>", "Root XML element")
  .option("--parse-element <element-name>", "Name of XML element to JSON")
  .option(
    "-e, --elements <name>",
    "Friendly name for elements to parse. Sets root-element and parse-element [hero]",
    /^heroes|maps|mounts$/
  )
  .option("--detailed", "Generate very detailed JSON")
  .option("--save-source-files", "Save source files (XML, txt, etc.) to out directory")
  .option("--archive-source-files", "Bundle source files into a zip file")
  .option("--archive-json", "Bundle JSON into a zip file")
  .option("-l, --log-level [level]", "Log level (none|info|debug)", /^none|info|debug$/, 'info')
  .option("--config-file <fileName>", "Use config file. Can be JSON or Javascript")
  .parse(process.argv)

const args = program.args

if(args.length === 0) {
  console.error("Source directory is required.")
}

const options: Partial<ParseOptions> = {
  sourceDir: args[0],
  sourceCASCStorage: program.gameDir,
  buildNumber: program.buildNumber ? parseInt(program.buildNumber): null,
  rootElementName: program.rootElement,
  parseElementName: program.parseElement,
  saveSourceFiles: program.saveSourceFiles,
  archiveSourceFiles: program.archiveSourceFiles,
  saveJSON: true,
  archiveJSON: program.archiveJson,
  logLevel: program.logLevel,
}

if(program.elements) {
  switch(program.elements) {
    case 'heroes':
      options.rootElementName = 'CConfig'
      options.parseElementName = 'HeroArray'
      break;

    case 'maps':
      break;

    case 'mounts':
      options.rootElementName = 'CConfig'
      options.parseElementName = 'MountArray'
      break;
  }
}

options.elementFunctions = program.detailed ? DETAILED_FUNCTIONS : DETAILED_FUNCTIONS

if(program.configFile) {
  Object.assign(options, require(program.configFile))
}

parse(options)
  .catch(error => console.error(error))
