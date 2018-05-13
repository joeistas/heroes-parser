#!/usr/bin/env node

import { join, resolve } from 'path'

import *  as program from 'commander'
import { openStorage, closeStorage, getStorageInfo } from 'casclib'

import { extractAssets, ExtractOptions } from '../extract'
import { buildLogger, getLogger, Logger } from '../logger'

interface ExtractCommandOptions extends ExtractOptions {
  logger: Logger
}

program
  .description("Extract asset files from Heroes of the Storm game data")
  .option("--out-dir <dir>", "Directory to save extracted file")
  .option("--asset-type <asset-type>", "Type of assets to extract (all|audio|images)", /^all|audio|images$/, 'all')
  .option("--from-json <json-file>", "Extract assests referenced in json file")
  .option("--log-level <level>", "Log level (none|info|debug)", /^none|info|debug$/, 'info')
  .option("--config-file <fileName>", "Use config file. Can be JSON or Javascript")
  .parse(process.argv)

const args = program.args

if(args.length === 0) {
  console.error("Game directory is required.")
  process.exit(1)
}

const options: ExtractCommandOptions = {
  outputDir: program.outDir,
  filePaths: args.slice(1),
  type: program.assetType,
  logger: console
}

if(program.fromJson) {
  options.jsonData = require(resolve(process.cwd(), program.fromJson))
}

if(program.configFile) {
  Object.assign(options, require(resolve(process.cwd(), program.configFile)))
}

const logger = buildLogger(options.logger, program.logLevel)

logger.info("Opening Storage")
openStorage(args[0])
  .then(storageHandle => {
    const storageInfo = getStorageInfo(storageHandle)
    let outDir = options.outputDir || process.cwd()
    outDir = join(outDir, storageInfo.gameBuild.toString(), 'assets')
    options.outputDir = outDir

    logger.info("Extracting assets")
    return extractAssets(storageHandle, options)
      .then(() => {
        closeStorage(storageHandle)
        logger.info("Assets successfully extracted to: " + resolve(program.outDir))
      })
      .catch(error => {
        closeStorage(storageHandle)
        logger.error(error)
      })
  })
