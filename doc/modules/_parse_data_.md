[heroes-parser](../README.md) > ["parse-data"](../modules/_parse_data_.md)

# External module: "parse-data"

## Index

### Interfaces

* [ParseData](../interfaces/_parse_data_.parsedata.md)
* [SourceData](../interfaces/_parse_data_.sourcedata.md)

### Functions

* [buildParseData](_parse_data_.md#buildparsedata)
* [loadSourceData](_parse_data_.md#loadsourcedata)

---

## Functions

<a id="buildparsedata"></a>

###  buildParseData

▸ **buildParseData**(sourceData: *[SourceData](../interfaces/_parse_data_.sourcedata.md)*, options: *[ParseOptions](../interfaces/_parse_options_.parseoptions.md)*): `Promise`<[ParseData](../interfaces/_parse_data_.parsedata.md)>

*Defined in [parse-data.ts:56](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parse-data.ts#L56)*

Build ParseData from `sourceData` and [ParseOptions](../interfaces/_parse_options_.parseoptions.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| sourceData | [SourceData](../interfaces/_parse_data_.sourcedata.md) |
| options | [ParseOptions](../interfaces/_parse_options_.parseoptions.md) |

**Returns:** `Promise`<[ParseData](../interfaces/_parse_data_.parsedata.md)>

___
<a id="loadsourcedata"></a>

###  loadSourceData

▸ **loadSourceData**(options: *[ParseOptions](../interfaces/_parse_options_.parseoptions.md)*): `Promise`<[SourceData](../interfaces/_parse_data_.sourcedata.md)>

*Defined in [parse-data.ts:80](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parse-data.ts#L80)*

Load source data from game directory or files at `outDir`

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [ParseOptions](../interfaces/_parse_options_.parseoptions.md) |

**Returns:** `Promise`<[SourceData](../interfaces/_parse_data_.sourcedata.md)>

___

