[heroes-parser](../README.md) > ["index"](../modules/_index_.md) > [parsers](../modules/_index_.parsers.md)

# Module: parsers

## Index

### Type aliases

* [ElementParser](_index_.parsers.md#elementparser)
* [ParseContext](_index_.parsers.md#parsecontext)

### Variables

* [add](_index_.parsers.md#add)
* [assets](_index_.parsers.md#assets)
* [conditional](_index_.parsers.md#conditional)
* [defaultPreParser](_index_.parsers.md#defaultpreparser)
* [join](_index_.parsers.md#join)
* [merge](_index_.parsers.md#merge)
* [nameFilters](_index_.parsers.md#namefilters)
* [text](_index_.parsers.md#text)

---

## Type aliases

<a id="elementparser"></a>

###  ElementParser

**ΤElementParser**: *`baseParsers.ElementParser`*

*Defined in [index.ts:53](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L53)*

___
<a id="parsecontext"></a>

###  ParseContext

**ΤParseContext**: *[ParseContext](../interfaces/_parsers_index_.parsecontext.md)*

*Defined in [index.ts:54](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L54)*

___

## Variables

<a id="add"></a>

### `<Const>` add

**● add**: *[&quot;parsers/add-parsers&quot;](_parsers_add_parsers_.md)* =  addParsers

*Defined in [index.ts:59](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L59)*

___
<a id="assets"></a>

### `<Const>` assets

**● assets**: *[&quot;parsers/asset-parsers&quot;](_parsers_asset_parsers_.md)* =  assetParsers

*Defined in [index.ts:60](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L60)*

___
<a id="conditional"></a>

### `<Const>` conditional

**● conditional**: *[&quot;parsers/conditional-parsers&quot;](_parsers_conditional_parsers_.md)* =  conditionalParsers

*Defined in [index.ts:63](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L63)*

___
<a id="defaultpreparser"></a>

### `<Const>` defaultPreParser

**● defaultPreParser**: *`function`* =  baseParsers.defaultPreParser

*Defined in [index.ts:57](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L57)*

#### Type declaration
▸(element: *`any`*, outerElement: *`any`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, context: *[ParseContext](../interfaces/_parsers_index_.parsecontext.md)*): `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |
| outerElement | `any` |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |
| context | [ParseContext](../interfaces/_parsers_index_.parsecontext.md) |

**Returns:** `any`

___
<a id="join"></a>

### `<Const>` join

**● join**: *[join](_parsers_index_.md#join)* =  baseParsers.join

*Defined in [index.ts:56](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L56)*

___
<a id="merge"></a>

### `<Const>` merge

**● merge**: *[&quot;parsers/merge-parsers&quot;](_parsers_merge_parsers_.md)* =  mergeParsers

*Defined in [index.ts:61](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L61)*

___
<a id="namefilters"></a>

### `<Const>` nameFilters

**● nameFilters**: *[&quot;parsers/element-name-filters&quot;](_parsers_element_name_filters_.md)* =  elementNameFilters

*Defined in [index.ts:64](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L64)*

___
<a id="text"></a>

### `<Const>` text

**● text**: *[&quot;parsers/text-parsers&quot;](_parsers_text_parsers_.md)* =  textParsers

*Defined in [index.ts:62](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/index.ts#L62)*

___

