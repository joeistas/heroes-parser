#!/usr/bin/env node

import { resolve, join } from 'path'
import *  as program from 'commander'

import {
  ParseData,
  BASE_FUNCTIONS,
  DETAILED_FUNCTIONS,
  SKIN_FUNCTIONS,
  VO_FUNCTIONS,
  BASIC_FUNCTIONS,
  ParseOptions,
  buildParseOptions,
  buildParseData,
  loadSourceData,
  buildLogger,
  initialElements,
  parseElements,
} from '../index'
import {
  saveJSON,
  saveJSONArchive,
  saveSourceFiles,
  saveSourceArchive,
  buildAssetListFileData,
  formatElementName,
} from '../files'

interface ParseCommandOptions extends ParseOptions {
  saveSourceFiles: boolean
  saveJSON: boolean
  archiveSourceFiles: boolean
  archiveJSON: boolean
  outputPath: string
  profileName: string
  buildNumber: number,
}

program
  .description("Generate JSON from Heroes of the Storm data")
  .option("--out-dir <dir>", "Directory to save JSON and source files")
  .option("--no-game-dir", "Source directory is not the Heroes of the Storm install directory")
  .option("--build-number <number>", "Build number to use if the source is not a game directory")
  .option("--root-element <element-name>", "Root XML element")
  .option("--root-id <element-id>", "Root XML element Id")
  .option("--parse-element <element-name>", "Name of XML element to JSON")
  .option(
    "--elements <name>",
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

const options: Partial<ParseCommandOptions> = {
  sourceDir: args[0],
  outputPath: process.cwd(),
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
    options.profileName = 'base'
    options.elementFunctions = BASE_FUNCTIONS
    break;

  case 'detailed':
    options.profileName = 'detailed'
    options.elementFunctions = DETAILED_FUNCTIONS
    break;

  case 'skins':
    options.profileName = 'skins'
    options.elementFunctions = SKIN_FUNCTIONS
    break;

  case 'vo':
    options.profileName = 'vo'
    options.elementFunctions = VO_FUNCTIONS
    break;

  case 'basic':
  default:
    options.profileName = 'basic'
    options.elementFunctions = BASIC_FUNCTIONS
}

if(program.configFile) {
  Object.assign(options, require(resolve(process.cwd(), program.configFile)))
}

parse(options)
  .catch(error => console.error(error))

async function parse(options: Partial<ParseCommandOptions>): Promise<any[]> {
  const parseOptions = buildParseOptions(options) as ParseCommandOptions

  const logger = buildLogger(parseOptions.logger, options.logLevel)

  const elementName = formatElementName(parseOptions)
  let parseData: ParseData
  let buildNumber: number
  try {
    const sourceData = await loadSourceData(parseOptions)
    buildNumber = sourceData.buildNumber || options.buildNumber

    if(options.sourceCASCStorage && options.saveSourceFiles && options.archiveSourceFiles) {
      saveSourceArchive(
        [
          ...sourceData.XML,
          ...sourceData.text,
          buildAssetListFileData(sourceData.assets)
        ],
        options.outputPath,
        `HOTS-${ buildNumber }-source.zip`
      )
    }

    if(options.sourceCASCStorage && options.saveSourceFiles) {
      saveSourceFiles(
        [
          ...sourceData.XML,
          ...sourceData.text,
          buildAssetListFileData(sourceData.assets)
        ],
        join(options.outputPath, buildNumber.toString(), 'source')
      )
    }

    parseData = await buildParseData(sourceData, parseOptions)
  }
  catch(error) {
    logger.error(error)
    return null
  }

  logger.info(`Building JSON for ${ parseOptions.rootElementName } ${ parseOptions.parseElementName } elements.`)
  const elements: any[] = initialElements(parseData)
  const parsedElements = parseElements(
    parseOptions.parseElementName || parseOptions.rootElementName,
    elements,
    parseData
  )

  if(parseOptions.archiveJSON) {
    await saveJSONArchive(parsedElements, options.outputPath, `HOTS-${ elementName }-${ buildNumber }-${ options.profileName }.zip`)
  }
  else {
    await saveJSON(parsedElements, join(options.outputPath, buildNumber.toString(), options.profileName, elementName))
  }

  logger.info("Parsing Complete!")
}
