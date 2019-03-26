[heroes-parser](../README.md) > ["parsers/element-name-filters"](../modules/_parsers_element_name_filters_.md)

# External module: "parsers/element-name-filters"

## Index

### Type aliases

* [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

### Functions

* [inList](_parsers_element_name_filters_.md#inlist)
* [join](_parsers_element_name_filters_.md#join)
* [startsWith](_parsers_element_name_filters_.md#startswith)

---

## Type aliases

<a id="elementnamefilter"></a>

###  ElementNameFilter

**ΤElementNameFilter**: *`function`*

*Defined in [parsers/element-name-filters.ts:3](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/element-name-filters.ts#L3)*

#### Type declaration
▸(parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `string`[]

**Parameters:**

| Param | Type |
| ------ | ------ |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `string`[]

___

## Functions

<a id="inlist"></a>

###  inList

▸ **inList**(...list: *`string`[]*): [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

*Defined in [parsers/element-name-filters.ts:23](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/element-name-filters.ts#L23)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` list | `string`[] |

**Returns:** [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

___
<a id="join"></a>

###  join

▸ **join**(...filters: *[ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)[]*): [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

*Defined in [parsers/element-name-filters.ts:5](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/element-name-filters.ts#L5)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` filters | [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)[] |

**Returns:** [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

___
<a id="startswith"></a>

###  startsWith

▸ **startsWith**(startsWith: *`string`*): [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

*Defined in [parsers/element-name-filters.ts:12](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/element-name-filters.ts#L12)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| startsWith | `string` |

**Returns:** [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)

___

