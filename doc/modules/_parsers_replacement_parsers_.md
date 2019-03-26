[heroes-parser](../README.md) > ["parsers/replacement-parsers"](../modules/_parsers_replacement_parsers_.md)

# External module: "parsers/replacement-parsers"

## Index

### Functions

* [replaceAttributeWithElementAttribute](_parsers_replacement_parsers_.md#replaceattributewithelementattribute)
* [replaceAttributesWithElementAttribute](_parsers_replacement_parsers_.md#replaceattributeswithelementattribute)

---

## Functions

<a id="replaceattributewithelementattribute"></a>

###  replaceAttributeWithElementAttribute

▸ **replaceAttributeWithElementAttribute**(elementNameOrFilter: * `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)*, attribute?: *`string`*, valueAttribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/replacement-parsers.ts:30](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/replacement-parsers.ts#L30)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| elementNameOrFilter |  `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)| - |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="replaceattributeswithelementattribute"></a>

###  replaceAttributesWithElementAttribute

▸ **replaceAttributesWithElementAttribute**(regexp: *`RegExp`*, elementNameOrFilter: * `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)*, valueAttribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/replacement-parsers.ts:10](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/replacement-parsers.ts#L10)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| regexp | `RegExp` | - |
| elementNameOrFilter |  `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)| - |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___

