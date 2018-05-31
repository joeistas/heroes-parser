[heroes-parser](../README.md) > ["formatters/array-formatters"](../modules/_formatters_array_formatters_.md)

# External module: "formatters/array-formatters"

## Index

### Type aliases

* [ElementArrayConditional](_formatters_array_formatters_.md#elementarrayconditional)

### Variables

* [defaultArrayFormatter](_formatters_array_formatters_.md#defaultarrayformatter)
* [isEmpty](_formatters_array_formatters_.md#isempty)
* [removeIfEmpty](_formatters_array_formatters_.md#removeifempty)

### Functions

* [allHaveAttribute](_formatters_array_formatters_.md#allhaveattribute)
* [combineBy](_formatters_array_formatters_.md#combineby)
* [conditionallyFormatArray](_formatters_array_formatters_.md#conditionallyformatarray)
* [elementsAreObjects](_formatters_array_formatters_.md#elementsareobjects)
* [firstValue](_formatters_array_formatters_.md#firstvalue)
* [isLengthEqualTo](_formatters_array_formatters_.md#islengthequalto)
* [join](_formatters_array_formatters_.md#join)
* [lastValue](_formatters_array_formatters_.md#lastvalue)
* [passThrough](_formatters_array_formatters_.md#passthrough)
* [reduceToSingleObject](_formatters_array_formatters_.md#reducetosingleobject)
* [removeArray](_formatters_array_formatters_.md#removearray)

---

## Type aliases

<a id="elementarrayconditional"></a>

###  ElementArrayConditional

**ΤElementArrayConditional**: *`function`*

*Defined in [formatters/array-formatters.ts:5](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L5)*

#### Type declaration
▸(elements: *`any`[]*): `boolean`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `boolean`

___

## Variables

<a id="defaultarrayformatter"></a>

### `<Const>` defaultArrayFormatter

**● defaultArrayFormatter**: *`function`* =  join(
  conditionallyFormatArray(
    allHaveAttribute("index"),
    combineBy("index")
  ),
  conditionallyFormatArray(
    isLengthEqualTo(1),
    firstValue,
    passThrough
  ),
  removeIfEmpty,
)

*Defined in [formatters/array-formatters.ts:10](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L10)*

#### Type declaration
▸(elements: *`any`[]*): `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `any`

___
<a id="isempty"></a>

### `<Const>` isEmpty

**● isEmpty**: *`function`* =  isLengthEqualTo(0)

*Defined in [formatters/array-formatters.ts:7](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L7)*

#### Type declaration
▸(elements: *`any`[]*): `boolean`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `boolean`

___
<a id="removeifempty"></a>

### `<Const>` removeIfEmpty

**● removeIfEmpty**: *`function`* =  conditionallyFormatArray(isEmpty, removeArray)

*Defined in [formatters/array-formatters.ts:8](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L8)*

#### Type declaration
▸(elements: *`any`[]*): `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `any`

___

## Functions

<a id="allhaveattribute"></a>

###  allHaveAttribute

▸ **allHaveAttribute**(attribute?: *`string`*): `(Anonymous function)`

*Defined in [formatters/array-formatters.ts:61](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L61)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;index&quot; |

**Returns:** `(Anonymous function)`

___
<a id="combineby"></a>

###  combineBy

▸ **combineBy**(indexAttribute?: *`string`*, removeIndexAttribute?: *`boolean`*): `(Anonymous function)`

*Defined in [formatters/array-formatters.ts:78](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L78)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` indexAttribute | `string` | &quot;index&quot; |
| `Default value` removeIndexAttribute | `boolean` | true |

**Returns:** `(Anonymous function)`

___
<a id="conditionallyformatarray"></a>

###  conditionallyFormatArray

▸ **conditionallyFormatArray**(conditional: *[ElementArrayConditional](_formatters_array_formatters_.md#elementarrayconditional)*, whenTrue?: *[ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)*, whenFalse?: *[ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)*): [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)

*Defined in [formatters/array-formatters.ts:41](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L41)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| conditional | [ElementArrayConditional](_formatters_array_formatters_.md#elementarrayconditional) | - |
| `Default value` whenTrue | [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter) |  passThrough |
| `Default value` whenFalse | [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter) |  passThrough |

**Returns:** [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)

___
<a id="elementsareobjects"></a>

###  elementsAreObjects

▸ **elementsAreObjects**(elements: *`any`[]*): `boolean`

*Defined in [formatters/array-formatters.ts:57](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L57)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `boolean`

___
<a id="firstvalue"></a>

###  firstValue

▸ **firstValue**(elements: *`any`[]*): `any`

*Defined in [formatters/array-formatters.ts:91](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L91)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `any`

___
<a id="islengthequalto"></a>

###  isLengthEqualTo

▸ **isLengthEqualTo**(length: *`number`*): [ElementArrayConditional](_formatters_array_formatters_.md#elementarrayconditional)

*Defined in [formatters/array-formatters.ts:51](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L51)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| length | `number` |

**Returns:** [ElementArrayConditional](_formatters_array_formatters_.md#elementarrayconditional)

___
<a id="join"></a>

###  join

▸ **join**(...formatters: *[ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)[]*): [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)

*Defined in [formatters/array-formatters.ts:23](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L23)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` formatters | [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)[] |

**Returns:** [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)

___
<a id="lastvalue"></a>

###  lastValue

▸ **lastValue**(elements: *`any`[]*): `any`

*Defined in [formatters/array-formatters.ts:99](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L99)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `any`

___
<a id="passthrough"></a>

###  passThrough

▸ **passThrough**(elements: *`any`[]*): `any`

*Defined in [formatters/array-formatters.ts:37](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L37)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `any`

___
<a id="reducetosingleobject"></a>

###  reduceToSingleObject

▸ **reduceToSingleObject**(mergeOntoOuterElement?: *`boolean`*): [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)

*Defined in [formatters/array-formatters.ts:67](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L67)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` mergeOntoOuterElement | `boolean` | false |

**Returns:** [ElementArrayFormatter](_formatters_index_.md#elementarrayformatter)

___
<a id="removearray"></a>

###  removeArray

▸ **removeArray**(elements: *`any`[]*): `null`

*Defined in [formatters/array-formatters.ts:33](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/array-formatters.ts#L33)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `null`

___

