[heroes-parser](../README.md) > ["text"](../modules/_text_.md)

# External module: "text"

## Index

### Type aliases

* [LocaleTextMap](_text_.md#localetextmap)
* [TextMap](_text_.md#textmap)

### Functions

* [localeFromFilePath](_text_.md#localefromfilepath)

---

## Type aliases

<a id="localetextmap"></a>

###  LocaleTextMap

**ΤLocaleTextMap**: *`Map`<`string`, `string`>*

*Defined in [text.ts:5](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/text.ts#L5)*

___
<a id="textmap"></a>

###  TextMap

**ΤTextMap**: *`Map`<`string`, [LocaleTextMap](_text_.md#localetextmap)>*

*Defined in [text.ts:16](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/text.ts#L16)*

Map containing all of the text from parsed text files

Structure:

Text key ->

locale -> text

___

## Functions

<a id="localefromfilepath"></a>

###  localeFromFilePath

▸ **localeFromFilePath**(filePath: *`string`*): `string`

*Defined in [text.ts:52](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/text.ts#L52)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| filePath | `string` |

**Returns:** `string`

___

