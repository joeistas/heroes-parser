[heroes-parser](../README.md) > ["parse-options"](../modules/_parse_options_.md)

# External module: "parse-options"

## Index

### Interfaces

* [ParseOptions](../interfaces/_parse_options_.parseoptions.md)

### Functions

* [buildParseOptions](_parse_options_.md#buildparseoptions)

### Object literals

* [DEFAULT_PARSE_OPTIONS](_parse_options_.md#default_parse_options)

---

## Functions

<a id="buildparseoptions"></a>

###  buildParseOptions

▸ **buildParseOptions**Options(options: *`Partial`<`Options`>*): [ParseOptions](../interfaces/_parse_options_.parseoptions.md)

*Defined in [parse-options.ts:70](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L70)*

Build parse options. Merges `options` with [DEFAULT\_PARSE\_OPTIONS](_parse_options_.md#default_parse_options)

**Type parameters:**

#### Options :  [ParseOptions](../interfaces/_parse_options_.parseoptions.md)
**Parameters:**

| Param | Type |
| ------ | ------ |
| options | `Partial`<`Options`> |

**Returns:** [ParseOptions](../interfaces/_parse_options_.parseoptions.md)

___

## Object literals

<a id="default_parse_options"></a>

### `<Const>` DEFAULT_PARSE_OPTIONS

**DEFAULT_PARSE_OPTIONS**: *`object`*

*Defined in [parse-options.ts:42](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L42)*

<a id="default_parse_options.assetsearchpatterns"></a>

####  assetSearchPatterns

**● assetSearchPatterns**: *`string`[]* =  [
    "mods/core.stormmod/*.stormassets/*",
    "mods/heroes.stormmod/*.stormassets/*",
  ]

*Defined in [parse-options.ts:55](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L55)*

___
<a id="default_parse_options.elementfunctions"></a>

####  elementFunctions

**● elementFunctions**: *`object`* =  DETAILED_FUNCTIONS

*Defined in [parse-options.ts:62](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L62)*

#### Type declaration

___
<a id="default_parse_options.loglevel"></a>

####  logLevel

**● logLevel**: *"info"* = "info"

*Defined in [parse-options.ts:63](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L63)*

___
<a id="default_parse_options.logger"></a>

####  logger

**● logger**: *`Console`* =  console

*Defined in [parse-options.ts:64](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L64)*

___
<a id="default_parse_options.parseelementname"></a>

####  parseElementName

**● parseElementName**: *`string`* = "HeroArray"

*Defined in [parse-options.ts:61](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L61)*

___
<a id="default_parse_options.rootelementid"></a>

####  rootElementId

**● rootElementId**: *`string`* = "Config"

*Defined in [parse-options.ts:60](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L60)*

___
<a id="default_parse_options.rootelementname"></a>

####  rootElementName

**● rootElementName**: *`string`* = "CConfig"

*Defined in [parse-options.ts:59](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L59)*

___
<a id="default_parse_options.sourcecascstorage"></a>

####  sourceCASCStorage

**● sourceCASCStorage**: *`true`* = true

*Defined in [parse-options.ts:44](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L44)*

___
<a id="default_parse_options.sourcedir"></a>

####  sourceDir

**● sourceDir**: *`null`* =  null

*Defined in [parse-options.ts:43](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L43)*

___
<a id="default_parse_options.textsearchpatterns"></a>

####  textSearchPatterns

**● textSearchPatterns**: *`string`[]* =  [
    "mods/core.stormmod/*.stormdata/LocalizedData/*.txt",
    "mods/heroesdata.stormmod/*/LocalizedData/*.txt",
    "mods/heromods/*/LocalizedData/*.txt",
  ]

*Defined in [parse-options.ts:50](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L50)*

___
<a id="default_parse_options.xmlsearchpatterns"></a>

####  xmlSearchPatterns

**● xmlSearchPatterns**: *`string`[]* =  [
    "mods/core.stormmod/base.stormdata/GameData/*Data.xml",
    "mods/heroesdata.stormmod/base.stormdata/GameData/*Data.xml",
    "mods/heromods/*.stormmod/base.stormdata/GameData/*.xml",
  ]

*Defined in [parse-options.ts:45](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L45)*

___

___

