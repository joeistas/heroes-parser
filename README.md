heroes-parser
============

Parse Heroes of the Storm game data into JSON from the command line or in Node.

Installation
------------
heroes-parser has been tested on Windows and Linux. To use from the command line install it globally.

With npm:

    npm install -g heroes-parser

With yarn:

    yarn global add heroes-parser


 To use in your project using npm

    npm install heroes-parser

or with yarn

    yarn add heroes-parser


Usage
-----------
heroes-parser can be used from the command line or from Node.

#### Command Line ####

Use `heroes-parser` or `heroes-parser parser` To convert elements from XML to JSON:

    Usage: heroes-parser parse <game-directory>

    Generate JSON from Heroes of the Storm data

    Options:

      --out-dir <dir>                 Directory to save JSON and source files
      --no-game-dir                   Game directory is not the Heroes of the Storm install directory
      --build-number <number>         Build number to use if the source is not a game directory
      --root-element <element-name>   Root XML element
      --root-id <element-id>          Root XML element Id
      --parse-element <element-name>  Name of XML element to JSON
      --elements <name>               Friendly name for elements to parse. Sets root-element and parse-element (default: heroes)
      --profile <name>                Profile to use for parsing elements (default: basic)
      -s, --save-source-files         Save source files (XML, txt, etc.) to output directory
      -S, --archive-source-files      Bundle source files into a zip file
      -a, --archive-json              Bundle JSON into a zip file
      --log-level <level>             Log level (none|info|debug) (default: info)
      --config-file <fileName>        Use config file. Can be JSON or Javascript
      -h, --help                      output usage information

Use `heroes-parser extract` to extract images and audio from the game data:

    Usage: heroes-parser extract extract <game-directory> [filePaths...]

    Extract asset files from Heroes of the Storm game data

    Options:

      --out-dir <dir>            Directory to save extracted file
      --asset-type <asset-type>  Type of assets to extract (all|audio|images) (default: all)
      --from-json <json-file>    Extract assests referenced in json file
      --log-level <level>        Log level (none|info|debug) (default: info)
      --config-file <fileName>   Use config file. Can be JSON or Javascript
      -h, --help                 output usage information

Use `heroes-parser elements` to view elements in Heroes of the Storm XML files:

    Usage: heroes-parser elements <game-directory>

    View elements in Heroes of the Storm XML files

    Options:

      --no-game-dir             Source directory is not the Heroes of the Storm install directory
      --name <name>             Only return elements with element name
      --starts-with <name>      Filter elements by element names that start with 'name'
      -n, --names-only          Only display element names
      -i, --ids-only            Only display element ids
      --find <id>               Find element by id
      -c, --count               Only display the count of matching elements
      --number <number>         Max number of elements to display. (default: 50)
      --config-file <fileName>  Use config file. Can be JSON or Javascript
      -h, --help                output usage information

#### Node ####
To convert Hero data into JSON:

    import {
      BASIC_FUNCTIONS,
      buildParseOptions,
      loadSourceData,
      buildParseData,
      initialElements,
      parseElements,
    } from 'heroes-parser'

    // See ParseOptions definition for detailed options
    const options = buildParseOptions({
      sourceDir: "path/to/game/directory",
      elementFunctions: BASIC_FUNCTIONS
    })

    loadSourceData(options)
      .then(sourceData => buildParseData(sourceData, options))
      .then(parseData => {
        const elements = initialElements(parseData)

        return parseElements(elements, parseData)
      })
      .then((heroJSON: any[]) => {
        // Your program
      })

[API](doc/README.md)
-----------
