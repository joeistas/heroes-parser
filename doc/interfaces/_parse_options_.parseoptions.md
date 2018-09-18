[heroes-parser](../README.md) > ["parse-options"](../modules/_parse_options_.md) > [ParseOptions](../interfaces/_parse_options_.parseoptions.md)

# Interface: ParseOptions

## Hierarchy

**ParseOptions**

## Index

### Properties

* [assetSearchPatterns](_parse_options_.parseoptions.md#assetsearchpatterns)
* [elementFunctions](_parse_options_.parseoptions.md#elementfunctions)
* [logLevel](_parse_options_.parseoptions.md#loglevel)
* [logger](_parse_options_.parseoptions.md#logger)
* [parseElementName](_parse_options_.parseoptions.md#parseelementname)
* [rootElementId](_parse_options_.parseoptions.md#rootelementid)
* [rootElementName](_parse_options_.parseoptions.md#rootelementname)
* [sourceCASCStorage](_parse_options_.parseoptions.md#sourcecascstorage)
* [sourceDir](_parse_options_.parseoptions.md#sourcedir)
* [textSearchPatterns](_parse_options_.parseoptions.md#textsearchpatterns)
* [xmlSearchPatterns](_parse_options_.parseoptions.md#xmlsearchpatterns)

---

## Properties

<a id="assetsearchpatterns"></a>

###  assetSearchPatterns

**● assetSearchPatterns**: *`string`[]*

*Defined in [parse-options.ts:15](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L15)*

patterns of asset files to load from CASC directory.

___
<a id="elementfunctions"></a>

###  elementFunctions

**● elementFunctions**: *`object`*

*Defined in [parse-options.ts:36](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L36)*

Functions used to define how to parse elements.

Default profiles: \[\[BASIC\_FUNCTIONS\]\] \[\[SKIN\_FUNCTIONS\]\] \[\[VO\_FUNCTIONS\]\] \[\[DETAILED\_FUNCTIONS\]\] \[\[BASE_FUNCTIONS\]\]

#### Type declaration

[elementName: `string`]: [ElementFunctions](_element_.elementfunctions.md)

___
<a id="loglevel"></a>

###  logLevel

**● logLevel**: * "none" &#124; "info" &#124; "debug"
*

*Defined in [parse-options.ts:38](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L38)*

set log level

___
<a id="logger"></a>

###  logger

**● logger**: *[Logger](_logger_.logger.md)*

*Defined in [parse-options.ts:39](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L39)*

___
<a id="parseelementname"></a>

### `<Optional>` parseElementName

**● parseElementName**: *`string`*

*Defined in [parse-options.ts:25](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L25)*

inner elmement name of elements to parse. Only used if elements to parse are inner elements of root element

___
<a id="rootelementid"></a>

###  rootElementId

**● rootElementId**: *`string`*

*Defined in [parse-options.ts:21](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L21)*

element id of element to start parsing. Only used if elements to parse are inner elements of root element

___
<a id="rootelementname"></a>

###  rootElementName

**● rootElementName**: *`string`*

*Defined in [parse-options.ts:17](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L17)*

element name of element to start parsing

___
<a id="sourcecascstorage"></a>

###  sourceCASCStorage

**● sourceCASCStorage**: *`boolean`*

*Defined in [parse-options.ts:9](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L9)*

true if [ParseOptions.sourceDir](_parse_options_.parseoptions.md#sourcedir) is a CASC directory

___
<a id="sourcedir"></a>

###  sourceDir

**● sourceDir**: *`string`*

*Defined in [parse-options.ts:7](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L7)*

path to CASC directory or xml files

___
<a id="textsearchpatterns"></a>

###  textSearchPatterns

**● textSearchPatterns**: *`string`[]*

*Defined in [parse-options.ts:13](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L13)*

patterns of text files to load from CASC directory.

___
<a id="xmlsearchpatterns"></a>

###  xmlSearchPatterns

**● xmlSearchPatterns**: *`string`[]*

*Defined in [parse-options.ts:11](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parse-options.ts#L11)*

patterns of xml files to load from CASC directory.

___

