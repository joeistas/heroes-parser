[heroes-parser](../README.md) > ["parsers/conditional-parsers"](../modules/_parsers_conditional_parsers_.md)

# External module: "parsers/conditional-parsers"

## Index

### Type aliases

* [ParserConditional](_parsers_conditional_parsers_.md#parserconditional)

### Functions

* [conditionallyParseElement](_parsers_conditional_parsers_.md#conditionallyparseelement)
* [outerElementHasName](_parsers_conditional_parsers_.md#outerelementhasname)
* [passThrough](_parsers_conditional_parsers_.md#passthrough)
* [pathHasValue](_parsers_conditional_parsers_.md#pathhasvalue)

---

## Type aliases

<a id="parserconditional"></a>

###  ParserConditional

**ΤParserConditional**: *`function`*

*Defined in [parsers/conditional-parsers.ts:8](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/conditional-parsers.ts#L8)*

#### Type declaration
▸(element: *`any`*, outerElement: *`any`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, context: *[ParseContext](../interfaces/_parsers_index_.parsecontext.md)*): `boolean`

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |
| outerElement | `any` |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |
| context | [ParseContext](../interfaces/_parsers_index_.parsecontext.md) |

**Returns:** `boolean`

___

## Functions

<a id="conditionallyparseelement"></a>

###  conditionallyParseElement

▸ **conditionallyParseElement**(conditional: *[ParserConditional](_parsers_conditional_parsers_.md#parserconditional)*, whenTrue?: *[ElementParser](_parsers_index_.md#elementparser)*, whenFalse?: *[ElementParser](_parsers_index_.md#elementparser)*): `(Anonymous function)`

*Defined in [parsers/conditional-parsers.ts:10](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/conditional-parsers.ts#L10)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| conditional | [ParserConditional](_parsers_conditional_parsers_.md#parserconditional) | - |
| `Default value` whenTrue | [ElementParser](_parsers_index_.md#elementparser) |  passThrough |
| `Default value` whenFalse | [ElementParser](_parsers_index_.md#elementparser) |  passThrough |

**Returns:** `(Anonymous function)`

___
<a id="outerelementhasname"></a>

###  outerElementHasName

▸ **outerElementHasName**(outerElementNameOrFilter: * [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter) &#124; `string`*): `(Anonymous function)`

*Defined in [parsers/conditional-parsers.ts:26](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/conditional-parsers.ts#L26)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| outerElementNameOrFilter |  [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter) &#124; `string`|

**Returns:** `(Anonymous function)`

___
<a id="passthrough"></a>

###  passThrough

▸ **passThrough**(element: *`any`*, outerElement: *`any`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, context: *[ParseContext](../interfaces/_parsers_index_.parsecontext.md)*): `any`

*Defined in [parsers/conditional-parsers.ts:22](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/conditional-parsers.ts#L22)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |
| outerElement | `any` |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |
| context | [ParseContext](../interfaces/_parsers_index_.parsecontext.md) |

**Returns:** `any`

___
<a id="pathhasvalue"></a>

###  pathHasValue

▸ **pathHasValue**(path: *`string`*, value: *`any`*): [ParserConditional](_parsers_conditional_parsers_.md#parserconditional)

*Defined in [parsers/conditional-parsers.ts:38](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/conditional-parsers.ts#L38)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| path | `string` |
| value | `any` |

**Returns:** [ParserConditional](_parsers_conditional_parsers_.md#parserconditional)

___

