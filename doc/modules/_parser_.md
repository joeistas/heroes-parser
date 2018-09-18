[heroes-parser](../README.md) > ["parser"](../modules/_parser_.md)

# External module: "parser"

## Index

### Functions

* [initialElements](_parser_.md#initialelements)
* [parseElements](_parser_.md#parseelements)

---

## Functions

<a id="initialelements"></a>

###  initialElements

▸ **initialElements**(parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `any`

*Defined in [parser.ts:14](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parser.ts#L14)*

get initial elements from `parseData`

**Parameters:**

| Param | Type |
| ------ | ------ |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `any`
list of elements

___
<a id="parseelements"></a>

###  parseElements

▸ **parseElements**(elementName: *`string`*, elementList: *`any`[]*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `any`[]

*Defined in [parser.ts:50](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parser.ts#L50)*

Parse and format elements in `elementList`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementName | `string` |
| elementList | `any`[] |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `any`[]
json from parsed elements

___

