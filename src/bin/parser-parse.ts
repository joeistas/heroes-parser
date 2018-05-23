#!/usr/bin/env node

import { resolve } from 'path'
import *  as program from 'commander'

import { parse, BASE_FUNCTIONS, DETAILED_FUNCTIONS, BASIC_FUNCTIONS, ParseOptions } from '../index'

program
  .description("Generate JSON from Heroes of the Storm data")
  .option("--out-dir <dir>", "Directory to save JSON and source files")
  .option("--no-game-dir", "Source directory is not the Heroes of the Storm install directory")
  .option("--build-number <number>", "Build number to use if the source is not a game directory")
  .option("--root-element <element-name>", "Root XML element")
  .option("--root-id <element-id>", "Root XML element Id")
  .option("--parse-element <element-name>", "Name of XML element to JSON")
  .option(
    "-e <name>, --elements <name>",
    "Friendly name for elements to parse. Sets root-element and parse-element [hero]",
    /^heroes|maps|mounts$/
  )
  .option("--profile <name>", "Profile to use for parsing elements [basic]")
  .option("-s, --save-source-files", "Save source files (XML, txt, etc.) to out directory")
  .option("-S, --archive-source-files", "Bundle source files into a zip file")
  .option("-a, --archive-json", "Bundle JSON into a zip file")
  .option("--log-level <level>", "Log level (none|info|debug)", /^none|info|debug$/, 'info')
  .option("--config-file <fileName>", "Use config file. Can be JSON or Javascript")
  .parse(process.argv)

const args = program.args

if(args.length === 0) {
  console.error("Source directory is required.")
  process.exit(1)
}

const options: Partial<ParseOptions> = {
  sourceDir: args[0],
  sourceCASCStorage: true,
  saveSourceFiles: false,
  archiveSourceFiles: false,
  archiveJSON: false,
  saveJSON: true,
  logLevel: program.logLevel,
}

if(program.outDir) {
  options.outputPath = program.outDir
}

if(program.gameDir) {
  options.sourceCASCStorage = program.gameDir
}

if(program.buildNumber) {
  options.buildNumber = parseInt(program.buildNumber)
}

if(program.rootElement) {
  options.rootElementName = program.rootElement
}

if(program.rootId) {
  options.rootElementId = program.rootId
}

if(program.parseElement) {
  options.parseElementName = program.parseElement
}

if(program.saveSourceFiles) {
  options.saveSourceFiles = program.saveSourceFiles
}

if(program.archiveSourceFiles) {
  options.archiveSourceFiles = program.archiveSourceFiles
}

if(program.archiveJson) {
  options.archiveJSON = program.archiveJson
}

switch(program.elements) {
  case 'heroes':
    options.rootElementName = 'CConfig'
    options.rootElementId = 'Config'
    options.parseElementName = 'HeroArray'
    break;

  case 'maps':
    break;

  case 'mounts':
    options.rootElementName = 'CConfig'
    options.rootElementId = 'Config'
    options.parseElementName = 'MountArray'
    break;
}

switch(program.profile) {
  case 'base':
    options.elementFunctions = BASE_FUNCTIONS
    break;

  case 'detailed':
    options.elementFunctions = DETAILED_FUNCTIONS
    break;

  case 'skins':
  case 'vo':
  case 'basic':
  default:
    options.elementFunctions = BASIC_FUNCTIONS
}

if(program.configFile) {
  Object.assign(options, require(resolve(process.cwd(), program.configFile)))
}

parse(options)
  .catch(error => console.error(error))
