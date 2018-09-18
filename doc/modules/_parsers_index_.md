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

* [join](_parsers_index_.md#join)

---

## Type aliases

<a id="elementparser"></a>

###  ElementParser

**ΤElementParser**: *`function`*

*Defined in [parsers/index.ts:20](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parsers/index.ts#L20)*

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

**● defaultPreParser**: *`function`* =  attributesToInnerElements(/^[A-Z]/)

*Defined in [parsers/index.ts:26](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parsers/index.ts#L26)*

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

<a id="join"></a>

###  join

▸ **join**(...processors: *[ElementParser](_parsers_index_.md#elementparser)[]*): `(Anonymous function)`

*Defined in [parsers/index.ts:28](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parsers/index.ts#L28)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` processors | [ElementParser](_parsers_index_.md#elementparser)[] |

**Returns:** `(Anonymous function)`

___

