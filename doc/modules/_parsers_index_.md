[heroes-parser](../README.md) > ["parsers/index"](../modules/_parsers_index_.md)

# External module: "parsers/index"

## Index

### Interfaces

* [ParseContext](../interfaces/_parsers_index_.parsecontext.md)

### Type aliases

* [ElementParser](_parsers_index_.md#elementparser)

### Variables

* [defaultPreParser](_parsers_index_.md#defaultpreparser)

### Functions

* [findElementName](_parsers_index_.md#findelementname)
* [join](_parsers_index_.md#join)

---

## Type aliases

<a id="elementparser"></a>

###  ElementParser

**ΤElementParser**: *`function`*

*Defined in [parsers/index.ts:18](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/index.ts#L18)*

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

## Variables

<a id="defaultpreparser"></a>

### `<Const>` defaultPreParser

**● defaultPreParser**: *`function`* =  join(
  attributesToInnerElements(/^[A-Z]/),
  replaceAttributesWithElementAttribute(/^\$.*/, 'const')
)

*Defined in [parsers/index.ts:24](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/index.ts#L24)*

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

## Functions

<a id="findelementname"></a>

###  findElementName

▸ **findElementName**(elementNameOrFilter: * `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)*, elementId: *`string`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `string`

*Defined in [parsers/index.ts:46](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/index.ts#L46)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementNameOrFilter |  `string` &#124; [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter)|
| elementId | `string` |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `string`

___
<a id="join"></a>

###  join

▸ **join**(...processors: *[ElementParser](_parsers_index_.md#elementparser)[]*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/index.ts:29](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/index.ts#L29)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` processors | [ElementParser](_parsers_index_.md#elementparser)[] |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___

