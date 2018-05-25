#!/usr/bin/env node

import { join, resolve } from 'path'
import { inspect } from 'util'

import *  as program from 'commander'
import { openStorage, closeStorage } from 'casclib'

import { ParseOptions } from '../index'
import { buildLogger } from '../logger'
import { buildParseOptions } from '../parse-options'
import { XML_FILE_GLOB, ParseData, loadXMLFilesFromCASC, loadFiles, fetchElements } from '../parse-data'
import { ELEMENT_NAME_KEY, findElementNameForId, getElement, joinElements, mergeWithParent } from '../element'
import { DETAILED_FUNCTIONS } from '../element-functions/detailed'

program
  .description("View element in Heroes of the Storm XML files")
  .option("--no-game-dir", "Source directory is not the Heroes of the Storm install directory")
  .option("--type <name>", "List elements with element name")
  .option("--starts-with <name>", "Filter elements by element names that start with 'name'")
  .option("-n, --names", "Only display element names")
  .option("-i, --ids", "Only display element ids")
  .option("--find <id>", "Find element ")
  .option("-c, --count", "Number of elements")
  .option("--number <number>", "Number of elements to display")
  .option("--config-file <fileName>", "Use config file. Can be JSON or Javascript")
  .parse(process.argv)

const args = program.args

if(args.length === 0) {
  console.error("Game directory is required.")
  process.exit(1)
}

const options: Partial<ParseOptions> = {
  sourceDir: args[0],
  sourceCASCStorage: true,
  logLevel: 'info',
}

if(program.configFile) {
  Object.assign(options, require(resolve(process.cwd(), program.configFile)))
}

const MAX_ELEMENTS = program.number || 50

const logger = buildLogger(options.logger, options.logLevel)
const parseOptions = buildParseOptions(options)

let promise
if(program.gameDir) {
  promise = openStorage(args[0])
    .then(storageHandle => {
      return loadXMLFilesFromCASC(parseOptions, storageHandle)
        .then(fileData => {
          closeStorage(storageHandle)
          return fileData
        })
    })
}
else {
  promise = loadFiles(args[0], XML_FILE_GLOB)
}

promise.then(fetchElements)
  .then(elementMap => {
    const parseData: any = {
      elements: elementMap,
      functions: DETAILED_FUNCTIONS,
      options: parseOptions,
    }

    let elementNames: string[] = [ ...elementMap.keys() ]

    if(program.type) {
      elementNames = [ program.type ]
    }

    if(program.startsWith) {
      elementNames = [ ...elementMap.keys() ].filter(key => key.startsWith(program.startsWith))
    }

    const total = elementNames.reduce((t, name) => {
      const elements = elementMap.get(name)
      return elements ? t + elements.size : t
    }, 0)

    logger.info("Total number of elements: " + total)

    if(program.count) {
      return
    }

    if(program.names) {
      logger.info("Element Names:")
      logger.group('info')
      elementNames.forEach(name => logger.info(name))
      logger.groupEnd('info')

      return
    }

    if(program.find) {
      const elementName = findElementNameForId(elementNames, program.find, elementMap)
      if(!elementName) {
        logger.info(`Element ${ program.find } not found.`)
      }

      logger.info(`Element name: ${ elementName }`)
      const element = prepareElement(elementName, getElement(program.find, elementName, elementMap), parseData)
      displayElements(element)

      return
    }

    if(program.ids) {
      for(const elementName of elementNames) {
        logger.info(elementName)
        logger.group('info')
        for(const id of elementMap.get(elementName).keys()) {
          logger.info(id)
        }
        logger.groupEnd('info')
      }

      return
    }

    let count = 0
    for(const elementName of elementNames) {
      logger.info(elementName)
      logger.group('info')
      for(const [ id, elements ] of elementMap.get(elementName).entries()) {
        count++
        const element = prepareElement(elementName, elements, parseData)
        displayElements(element)

        if(count >= MAX_ELEMENTS) {
          break;
        }
      }
      logger.groupEnd('info')
      logger.info()
      if(count >= MAX_ELEMENTS) {
        break;
      }
    }
  })
  .catch(e => logger.error(e))

function prepareElement(elementName: string, elements: any[], parseData: ParseData): any {
  let element = joinElements(elements)
  element = mergeWithParent(element, elementName, parseData)
  return element
}

function displayElements(...elements: any[]) {
  elements.forEach(element => {
    logger.info(inspect(element, false, null), '\n')
  })
}
