[heroes-parser](../README.md) > ["parsers/merge-parsers"](../modules/_parsers_merge_parsers_.md)

# External module: "parsers/merge-parsers"

## Index

### Functions

* [mergeElement](_parsers_merge_parsers_.md#mergeelement)
* [mergeElementFromInnerElementValue](_parsers_merge_parsers_.md#mergeelementfrominnerelementvalue)

---

## Functions

<a id="mergeelement"></a>

###  mergeElement

▸ **mergeElement**(elementNameOrFilter: * `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)*, attribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/merge-parsers.ts:12](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/merge-parsers.ts#L12)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| elementNameOrFilter |  `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)| - |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="mergeelementfrominnerelementvalue"></a>

###  mergeElementFromInnerElementValue

▸ **mergeElementFromInnerElementValue**(elementNameOrFilter: * `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)*, innerElementName: *`string`*, attribute?: *`string`*, removeInnerElements?: *`boolean`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/merge-parsers.ts:32](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/merge-parsers.ts#L32)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| elementNameOrFilter |  `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)| - |
| innerElementName | `string` | - |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` removeInnerElements | `boolean` | true |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___

