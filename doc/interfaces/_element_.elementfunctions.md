[heroes-parser](../README.md) > ["element"](../modules/_element_.md) > [ElementFunctions](../interfaces/_element_.elementfunctions.md)

# Interface: ElementFunctions

Functions used to parse and format the output of an element type

## Hierarchy

**ElementFunctions**

## Index

### Properties

* [formatArray](_element_.elementfunctions.md#formatarray)
* [formatElement](_element_.elementfunctions.md#formatelement)
* [formatKey](_element_.elementfunctions.md#formatkey)
* [merge](_element_.elementfunctions.md#merge)
* [postParse](_element_.elementfunctions.md#postparse)
* [preParse](_element_.elementfunctions.md#preparse)

---

## Properties

<a id="formatarray"></a>

### `<Optional>` formatArray

**● formatArray**: *[ElementArrayFormatter](../modules/_formatters_index_.md#elementarrayformatter)*

*Defined in [element.ts:28](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L28)*

format array of elements

___
<a id="formatelement"></a>

### `<Optional>` formatElement

**● formatElement**: *[ElementFormatter](../modules/_formatters_index_.md#elementformatter)*

*Defined in [element.ts:24](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L24)*

used to format the elmement. Run after attributes and inner elements are formatted

___
<a id="formatkey"></a>

### `<Optional>` formatKey

**● formatKey**: * [ElementKeyFormatter](../modules/_formatters_index_.md#elementkeyformatter) &#124; `string`
*

*Defined in [element.ts:26](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L26)*

format the key to be set on outer element

___
<a id="merge"></a>

### `<Optional>` merge

**● merge**: *`ElementMerger`*

*Defined in [element.ts:18](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L18)*

used to merge parent and child inner elements

___
<a id="postparse"></a>

### `<Optional>` postParse

**● postParse**: *[ElementParser](../modules/_parsers_index_.md#elementparser)*

*Defined in [element.ts:22](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L22)*

run at the end of element parsing, after inner elements are parsed

___
<a id="preparse"></a>

### `<Optional>` preParse

**● preParse**: *[ElementParser](../modules/_parsers_index_.md#elementparser)*

*Defined in [element.ts:20](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L20)*

run at the start of element parsing, before inner elements are parsed

___

