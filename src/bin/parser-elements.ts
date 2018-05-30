#!/usr/bin/env node

import { join, resolve } from 'path'
import { inspect } from 'util'

import *  as program from 'commander'
import { openStorage, closeStorage } from 'casclib'

import {
  ParseOptions,
  buildLogger,
  buildParseOptions,
  element,
  DETAILED_FUNCTIONS,
  ParseData,
} from '../index'
import { XML_FILE_GLOB, loadXMLFilesFromCASC, loadFiles, fetchElements } from '../parse-data'

const { ELEMENT_NAME_KEY, findElementNameForId, getElement, joinElements, mergeWithParent } = element

program
  .name("heroes-parser elements")
  .description("View elements in Heroes of the Storm XML files")
  .usage("<game-directory>")
  .option("--no-game-dir", "Source directory is not the Heroes of the Storm install directory")
  .option("--name <name>", "Only return elements with element name")
  .option("--starts-with <name>", "Filter elements by element names that start with 'name'")
  .option("-n, --names-only", "Only display element names")
  .option("-i, --ids-only", "Only display element ids")
  .option("--find <id>", "Find element by id")
  .option("-c, --count", "Only display the count of matching elements")
  .option("--number <number>", "Max number of elements to display.", "50")
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
