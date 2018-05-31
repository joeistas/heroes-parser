[heroes-parser](../README.md) > ["formatters/element-formatters"](../modules/_formatters_element_formatters_.md)

# External module: "formatters/element-formatters"

## Index

### Type aliases

* [ElementConditional](_formatters_element_formatters_.md#elementconditional)

### Variables

* [defaultElementFormatter](_formatters_element_formatters_.md#defaultelementformatter)
* [removeIfEmptyObject](_formatters_element_formatters_.md#removeifemptyobject)

### Functions

* [applyFormatterToAttribute](_formatters_element_formatters_.md#applyformattertoattribute)
* [attributeHasValue](_formatters_element_formatters_.md#attributehasvalue)
* [attributeIsDefined](_formatters_element_formatters_.md#attributeisdefined)
* [attributeIsNotDefined](_formatters_element_formatters_.md#attributeisnotdefined)
* [attributeToBoolean](_formatters_element_formatters_.md#attributetoboolean)
* [attributeToNumber](_formatters_element_formatters_.md#attributetonumber)
* [combineAttributes](_formatters_element_formatters_.md#combineattributes)
* [conditionallyFormatElement](_formatters_element_formatters_.md#conditionallyformatelement)
* [formatAttributeWithKeyFormatter](_formatters_element_formatters_.md#formatattributewithkeyformatter)
* [formatCompareOperator](_formatters_element_formatters_.md#formatcompareoperator)
* [hasKeys](_formatters_element_formatters_.md#haskeys)
* [hasNumberOfKeys](_formatters_element_formatters_.md#hasnumberofkeys)
* [isAttributeEmpty](_formatters_element_formatters_.md#isattributeempty)
* [isEmpty](_formatters_element_formatters_.md#isempty)
* [join](_formatters_element_formatters_.md#join)
* [not](_formatters_element_formatters_.md#not)
* [onlyHasKeys](_formatters_element_formatters_.md#onlyhaskeys)
* [parseFilterString](_formatters_element_formatters_.md#parsefilterstring)
* [passThrough](_formatters_element_formatters_.md#passthrough)
* [removeAttributeFromElement](_formatters_element_formatters_.md#removeattributefromelement)
* [removeFromOutput](_formatters_element_formatters_.md#removefromoutput)
* [removeFromStart](_formatters_element_formatters_.md#removefromstart)
* [removeFromStartOfAttribute](_formatters_element_formatters_.md#removefromstartofattribute)
* [selectAttributes](_formatters_element_formatters_.md#selectattributes)
* [some](_formatters_element_formatters_.md#some)
* [splitOnCaps](_formatters_element_formatters_.md#splitoncaps)
* [toKeyValuePair](_formatters_element_formatters_.md#tokeyvaluepair)
* [valueFromAttribute](_formatters_element_formatters_.md#valuefromattribute)
* [valueFromFirstKey](_formatters_element_formatters_.md#valuefromfirstkey)
* [valueToBoolean](_formatters_element_formatters_.md#valuetoboolean)
* [valueToNumber](_formatters_element_formatters_.md#valuetonumber)

---

## Type aliases

<a id="elementconditional"></a>

###  ElementConditional

**ΤElementConditional**: *`function`*

*Defined in [formatters/element-formatters.ts:9](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L9)*

#### Type declaration
▸(formattedElement: *`any`*, element: *`any`*): `boolean`

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `boolean`

___

## Variables

<a id="defaultelementformatter"></a>

### `<Const>` defaultElementFormatter

**● defaultElementFormatter**: *`function`* =  join(
  formatAttributeWithKeyFormatter(defaultKeyFormatter),
  attributeToNumber(LEVEL_SCALING_ATTRIBUTE),
  conditionallyFormatElement(
    onlyHasKeys('value'),
    valueFromAttribute('value')
  ),
  removeIfEmptyObject
)

*Defined in [formatters/element-formatters.ts:13](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L13)*

#### Type declaration
▸(formattedElement: *`any`*, element: *`any`*): `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `any`

___
<a id="removeifemptyobject"></a>

### `<Const>` removeIfEmptyObject

**● removeIfEmptyObject**: *`function`* =  conditionallyFormatElement(isEmpty, removeFromOutput)

*Defined in [formatters/element-formatters.ts:11](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L11)*

#### Type declaration
▸(formattedElement: *`any`*, element: *`any`*): `any`

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `any`

___

## Functions

<a id="applyformattertoattribute"></a>

###  applyFormatterToAttribute

▸ **applyFormatterToAttribute**(attribute?: *`string`*, formatter: *[ElementFormatter](_formatters_index_.md#elementformatter)*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:175](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L175)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| formatter | [ElementFormatter](_formatters_index_.md#elementformatter) | - |

**Returns:** `(Anonymous function)`

___
<a id="attributehasvalue"></a>

###  attributeHasValue

▸ **attributeHasValue**(attributeValue: *`string`*, attribute?: *`string`*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:92](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L92)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| attributeValue | `string` | - |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="attributeisdefined"></a>

###  attributeIsDefined

▸ **attributeIsDefined**(attribute?: *`string`*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:62](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L62)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="attributeisnotdefined"></a>

###  attributeIsNotDefined

▸ **attributeIsNotDefined**(attribute?: *`string`*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:68](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L68)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="attributetoboolean"></a>

###  attributeToBoolean

▸ **attributeToBoolean**(attribute?: *`string`*, trueValue?: *`string`*, falseValue?: *`string`*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:186](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L186)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` trueValue | `string` | &quot;1&quot; |
| `Default value` falseValue | `string` | &quot;0&quot; |

**Returns:** `(Anonymous function)`

___
<a id="attributetonumber"></a>

###  attributeToNumber

▸ **attributeToNumber**(attribute?: *`string`*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:190](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L190)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** `(Anonymous function)`

___
<a id="combineattributes"></a>

###  combineAttributes

▸ **combineAttributes**(newAttribute: *`string`*, ...attributesToMerge: *`string`[]*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:239](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L239)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| newAttribute | `string` |
| `Rest` attributesToMerge | `string`[] |

**Returns:** `(Anonymous function)`

___
<a id="conditionallyformatelement"></a>

###  conditionallyFormatElement

▸ **conditionallyFormatElement**(condition: *[ElementConditional](_formatters_element_formatters_.md#elementconditional)*, whenTrue?: *[ElementFormatter](_formatters_index_.md#elementformatter)*, whenFalse?: *[ElementFormatter](_formatters_index_.md#elementformatter)*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:36](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L36)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| condition | [ElementConditional](_formatters_element_formatters_.md#elementconditional) | - |
| `Default value` whenTrue | [ElementFormatter](_formatters_index_.md#elementformatter) |  passThrough |
| `Default value` whenFalse | [ElementFormatter](_formatters_index_.md#elementformatter) |  passThrough |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="formatattributewithkeyformatter"></a>

###  formatAttributeWithKeyFormatter

▸ **formatAttributeWithKeyFormatter**(formatter: *[ElementKeyFormatter](_formatters_index_.md#elementkeyformatter)*, attribute?: *`string`*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:198](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L198)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| formatter | [ElementKeyFormatter](_formatters_index_.md#elementkeyformatter) | - |
| `Default value` attribute | `string` | &quot;index&quot; |

**Returns:** `(Anonymous function)`

___
<a id="formatcompareoperator"></a>

###  formatCompareOperator

▸ **formatCompareOperator**(formattedElement: *`any`*, element: *`any`*):  "&#x3D;&#x3D;" &#124; "!&#x3D;" &#124; "&gt;" &#124; "&gt;&#x3D;" &#124; "&lt;" &#124; "&lt;&#x3D;"

*Defined in [formatters/element-formatters.ts:164](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L164)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:**  "&#x3D;&#x3D;" &#124; "!&#x3D;" &#124; "&gt;" &#124; "&gt;&#x3D;" &#124; "&lt;" &#124; "&lt;&#x3D;"

___
<a id="haskeys"></a>

###  hasKeys

▸ **hasKeys**(...keys: *`string`[]*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:72](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L72)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` keys | `string`[] |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="hasnumberofkeys"></a>

###  hasNumberOfKeys

▸ **hasNumberOfKeys**(length: *`number`*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:79](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L79)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| length | `number` |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="isattributeempty"></a>

###  isAttributeEmpty

▸ **isAttributeEmpty**(attribute?: *`string`*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:56](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L56)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** `(Anonymous function)`

___
<a id="isempty"></a>

###  isEmpty

▸ **isEmpty**(formattedElement: *`any`*, element: *`any`*): `boolean`

*Defined in [formatters/element-formatters.ts:52](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L52)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `boolean`

___
<a id="join"></a>

###  join

▸ **join**(...formatters: *[ElementFormatter](_formatters_index_.md#elementformatter)[]*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:23](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L23)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` formatters | [ElementFormatter](_formatters_index_.md#elementformatter)[] |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="not"></a>

###  not

▸ **not**(conditional: *[ElementConditional](_formatters_element_formatters_.md#elementconditional)*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:46](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L46)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| conditional | [ElementConditional](_formatters_element_formatters_.md#elementconditional) |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="onlyhaskeys"></a>

###  onlyHasKeys

▸ **onlyHasKeys**(...keys: *`string`[]*): [ElementConditional](_formatters_element_formatters_.md#elementconditional)

*Defined in [formatters/element-formatters.ts:85](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L85)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` keys | `string`[] |

**Returns:** [ElementConditional](_formatters_element_formatters_.md#elementconditional)

___
<a id="parsefilterstring"></a>

###  parseFilterString

▸ **parseFilterString**(formattedElement: *`any`*, element: *`any`*): `any`

*Defined in [formatters/element-formatters.ts:210](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L210)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `any`

___
<a id="passthrough"></a>

###  passThrough

▸ **passThrough**(formattedElement: *`any`*, element: *`any`*): `any`

*Defined in [formatters/element-formatters.ts:108](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L108)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `any`

___
<a id="removeattributefromelement"></a>

###  removeAttributeFromElement

▸ **removeAttributeFromElement**(key: *`string`*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:232](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L232)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="removefromoutput"></a>

###  removeFromOutput

▸ **removeFromOutput**(formattedElement: *`any`*, element: *`any`*): `null`

*Defined in [formatters/element-formatters.ts:104](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L104)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `null`

___
<a id="removefromstart"></a>

###  removeFromStart

▸ **removeFromStart**(remove: *`string`*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:158](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L158)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| remove | `string` |

**Returns:** `(Anonymous function)`

___
<a id="removefromstartofattribute"></a>

###  removeFromStartOfAttribute

▸ **removeFromStartOfAttribute**(remove: *`string`*, attribute?: *`string`*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:194](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L194)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| remove | `string` | - |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** `(Anonymous function)`

___
<a id="selectattributes"></a>

###  selectAttributes

▸ **selectAttributes**(...attributes: *`string`[]*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:112](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L112)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` attributes | `string`[] |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="some"></a>

###  some

▸ **some**(...conditionals: *[ElementConditional](_formatters_element_formatters_.md#elementconditional)[]*): `(Anonymous function)`

*Defined in [formatters/element-formatters.ts:98](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L98)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` conditionals | [ElementConditional](_formatters_element_formatters_.md#elementconditional)[] |

**Returns:** `(Anonymous function)`

___
<a id="splitoncaps"></a>

###  splitOnCaps

▸ **splitOnCaps**(formattedElement: *`any`*, element: *`any`*): `any`

*Defined in [formatters/element-formatters.ts:154](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L154)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `any`

___
<a id="tokeyvaluepair"></a>

###  toKeyValuePair

▸ **toKeyValuePair**(keyAttribute?: *`string`*, valueAttribute?: *`string`*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:202](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L202)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` keyAttribute | `string` | &quot;index&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="valuefromattribute"></a>

###  valueFromAttribute

▸ **valueFromAttribute**(attribute?: *`string`*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:124](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L124)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="valuefromfirstkey"></a>

###  valueFromFirstKey

▸ **valueFromFirstKey**(formattedElement: *`any`*, element: *`any`*): `string`

*Defined in [formatters/element-formatters.ts:130](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L130)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `string`

___
<a id="valuetoboolean"></a>

###  valueToBoolean

▸ **valueToBoolean**(trueValue?: *`string`*, falseValue?: *`string`*): [ElementFormatter](_formatters_index_.md#elementformatter)

*Defined in [formatters/element-formatters.ts:134](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L134)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` trueValue | `string` | &quot;1&quot; |
| `Default value` falseValue | `string` | &quot;0&quot; |

**Returns:** [ElementFormatter](_formatters_index_.md#elementformatter)

___
<a id="valuetonumber"></a>

###  valueToNumber

▸ **valueToNumber**(formattedElement: *`any`*, element: *`any`*): `any`

*Defined in [formatters/element-formatters.ts:148](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/formatters/element-formatters.ts#L148)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| formattedElement | `any` |
| element | `any` |

**Returns:** `any`

___

