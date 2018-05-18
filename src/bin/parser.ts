#!/usr/bin/env node

import *  as program from 'commander'

program
  .version("1.0.0")
  .command("parse <source-dir>", "Convert XML elements to JSON", { isDefault: true })
  .command("extract <game-directory> [filePaths...]", "Extract asset files from game data")
  .command("elements <game-directory>", "View element in Heroes of the Storm XML files")

// program
//   .command("extract <source-dir> <file-name>", "Extract asset file from game storage")

program.parse(process.argv)
