[heroes-parser](../README.md) > ["element-functions/function-templates"](../modules/_element_functions_function_templates_.md)

# External module: "element-functions/function-templates"

## Index

### Functions

* [addAttribute](_element_functions_function_templates_.md#addattribute)
* [arrayOfNumberValues](_element_functions_function_templates_.md#arrayofnumbervalues)
* [arrayOfSingleValues](_element_functions_function_templates_.md#arrayofsinglevalues)
* [assetArrayToSingleObject](_element_functions_function_templates_.md#assetarraytosingleobject)
* [assets](_element_functions_function_templates_.md#assets)
* [booleanValue](_element_functions_function_templates_.md#booleanvalue)
* [filters](_element_functions_function_templates_.md#filters)
* [flags](_element_functions_function_templates_.md#flags)
* [localeText](_element_functions_function_templates_.md#localetext)
* [localeTextToSingleObject](_element_functions_function_templates_.md#localetexttosingleobject)
* [mergeElement](_element_functions_function_templates_.md#mergeelement)
* [numberValue](_element_functions_function_templates_.md#numbervalue)
* [parseTooltip](_element_functions_function_templates_.md#parsetooltip)
* [removeIfValue](_element_functions_function_templates_.md#removeifvalue)
* [renderTooltip](_element_functions_function_templates_.md#rendertooltip)
* [singleAsset](_element_functions_function_templates_.md#singleasset)
* [singleElementWithReplacement](_element_functions_function_templates_.md#singleelementwithreplacement)
* [valueFromAttributeIfOnlyHasKeys](_element_functions_function_templates_.md#valuefromattributeifonlyhaskeys)
* [valuesToSingleObject](_element_functions_function_templates_.md#valuestosingleobject)
* [valuesToSingleObjectOfNumbers](_element_functions_function_templates_.md#valuestosingleobjectofnumbers)

### Object literals

* [removeFromOutput](_element_functions_function_templates_.md#removefromoutput)
* [singleElement](_element_functions_function_templates_.md#singleelement)

---

## Functions

<a id="addattribute"></a>

###  addAttribute

▸ **addAttribute**(attribute: *`string`*, attributeValue: *`any`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:41](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L41)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| attribute | `string` |
| attributeValue | `any` |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="arrayofnumbervalues"></a>

###  arrayOfNumberValues

▸ **arrayOfNumberValues**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:208](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L208)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="arrayofsinglevalues"></a>

###  arrayOfSingleValues

▸ **arrayOfSingleValues**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:202](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L202)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="assetarraytosingleobject"></a>

###  assetArrayToSingleObject

▸ **assetArrayToSingleObject**(keyAttribute?: *`string`*, valueAttribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:195](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L195)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` keyAttribute | `string` | &quot;index&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="assets"></a>

###  assets

▸ **assets**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:185](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L185)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="booleanvalue"></a>

###  booleanValue

▸ **booleanValue**(attribute?: *`string`*, trueValue?: *`string`*, falseValue?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:50](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L50)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` trueValue | `string` | &quot;1&quot; |
| `Default value` falseValue | `string` | &quot;0&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="filters"></a>

###  filters

▸ **filters**(attribute?: *`string`*, index?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:217](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L217)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` index | `string` | &quot;index&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="flags"></a>

###  flags

▸ **flags**(mergeOntoOuterElement?: *`boolean`*, keyAttribute?: *`string`*, valueAttribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:102](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L102)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` mergeOntoOuterElement | `boolean` | false |
| `Default value` keyAttribute | `string` | &quot;index&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="localetext"></a>

###  localeText

▸ **localeText**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:118](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L118)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="localetexttosingleobject"></a>

###  localeTextToSingleObject

▸ **localeTextToSingleObject**(keyAttribute?: *`string`*, valueAttribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:162](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L162)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` keyAttribute | `string` | &quot;index&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="mergeelement"></a>

###  mergeElement

▸ **mergeElement**(elementNameOrFilter: * [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter) &#124; `string`*, attribute?: *`string`*): `object`

*Defined in [element-functions/function-templates.ts:238](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L238)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| elementNameOrFilter |  [ElementNameFilter](_parsers_element_name_filters_.md#elementnamefilter) &#124; `string`| - |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** `object`

___
<a id="numbervalue"></a>

###  numberValue

▸ **numberValue**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:60](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L60)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="parsetooltip"></a>

###  parseTooltip

▸ **parseTooltip**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:138](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L138)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="removeifvalue"></a>

###  removeIfValue

▸ **removeIfValue**(attributeValue: *`string`*, attribute?: *`string`*): `object`

*Defined in [element-functions/function-templates.ts:70](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L70)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| attributeValue | `string` | - |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** `object`

___
<a id="rendertooltip"></a>

###  renderTooltip

▸ **renderTooltip**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:148](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L148)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="singleasset"></a>

###  singleAsset

▸ **singleAsset**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:174](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L174)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="singleelementwithreplacement"></a>

###  singleElementWithReplacement

▸ **singleElementWithReplacement**(attribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:21](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L21)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="valuefromattributeifonlyhaskeys"></a>

###  valueFromAttributeIfOnlyHasKeys

▸ **valueFromAttributeIfOnlyHasKeys**(attribute?: *`string`*, ...keys: *`string`[]*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:31](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L31)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Rest` keys | `string`[] | - |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="valuestosingleobject"></a>

###  valuesToSingleObject

▸ **valuesToSingleObject**(keyAttribute?: *`string`*, valueAttribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:81](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L81)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` keyAttribute | `string` | &quot;index&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___
<a id="valuestosingleobjectofnumbers"></a>

###  valuesToSingleObjectOfNumbers

▸ **valuesToSingleObjectOfNumbers**(keyAttribute?: *`string`*, valueAttribute?: *`string`*): [ElementFunctions](../interfaces/_element_.elementfunctions.md)

*Defined in [element-functions/function-templates.ts:91](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L91)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` keyAttribute | `string` | &quot;index&quot; |
| `Default value` valueAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___

## Object literals

<a id="removefromoutput"></a>

### `<Const>` removeFromOutput

**removeFromOutput**: *`object`*

*Defined in [element-functions/function-templates.ts:13](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L13)*

<a id="removefromoutput.formatelement"></a>

####  formatElement

**● formatElement**: *[removeFromOutput](_formatters_element_formatters_.md#removefromoutput)* =  elementFormatters.removeFromOutput

*Defined in [element-functions/function-templates.ts:14](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L14)*

___

___
<a id="singleelement"></a>

### `<Const>` singleElement

**singleElement**: *`object`*

*Defined in [element-functions/function-templates.ts:17](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L17)*

<a id="singleelement.merge"></a>

####  merge

**● merge**: *`singleElement`* =  elementMergers.singleElement

*Defined in [element-functions/function-templates.ts:18](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/element-functions/function-templates.ts#L18)*

___

___

