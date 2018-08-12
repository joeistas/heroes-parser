#!/usr/bin/env node

import *  as program from 'commander'

const packageSetup = require("../../package.json")

program
  .version(packageSetup.version)
  .name("heroes-parser")
  .command("parse <source-dir>", "Convert XML elements to JSON", { isDefault: true })
  .command("extract <game-directory> [filePaths...]", "Extract asset files from game data")
  .command("elements <game-directory>", "View element in Heroes of the Storm XML files")

// program
//   .command("extract <source-dir> <file-name>", "Extract asset file from game storage")

program.parse(process.argv)
