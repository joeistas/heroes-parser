[heroes-parser](../README.md) > ["extract"](../modules/_extract_.md) > [ExtractOptions](../interfaces/_extract_.extractoptions.md)

# Interface: ExtractOptions

Options used by [extractAssets](../modules/_extract_.md#extractassets)

## Hierarchy

**ExtractOptions**

## Index

### Properties

* [filePaths](_extract_.extractoptions.md#filepaths)
* [jsonData](_extract_.extractoptions.md#jsondata)
* [outputDir](_extract_.extractoptions.md#outputdir)
* [type](_extract_.extractoptions.md#type)

---

## Properties

<a id="filepaths"></a>

###  filePaths

**● filePaths**: *`string`[]*

*Defined in [extract.ts:16](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/extract.ts#L16)*

file paths of assets to extract from game storage

___
<a id="jsondata"></a>

### `<Optional>` jsonData

**● jsonData**: *`any`*

*Defined in [extract.ts:20](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/extract.ts#L20)*

extract assets found in json data instead of [ExtractOptions.filePaths](_extract_.extractoptions.md#filepaths)

___
<a id="outputdir"></a>

###  outputDir

**● outputDir**: *`string`*

*Defined in [extract.ts:14](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/extract.ts#L14)*

directory where extracted assets will be saved.

___
<a id="type"></a>

###  type

**● type**: * "all" &#124; "audio" &#124; "images"
*

*Defined in [extract.ts:18](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/extract.ts#L18)*

type of assets to extract

___

