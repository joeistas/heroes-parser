[heroes-parser](../README.md) > ["element"](../modules/_element_.md)

# External module: "element"

## Index

### Interfaces

* [ElementFunctions](../interfaces/_element_.elementfunctions.md)

### Type aliases

* [ElementFunctionsMap](_element_.md#elementfunctionsmap)

### Variables

* [ATTRIBUTE_BLACKLIST](_element_.md#attribute_blacklist)
* [ELEMENT_ATTRIBUTE_KEY](_element_.md#element_attribute_key)
* [ELEMENT_NAME_KEY](_element_.md#element_name_key)
* [ELEMENT_TEXT_KEY](_element_.md#element_text_key)

### Functions

* [buildElement](_element_.md#buildelement)
* [copyElement](_element_.md#copyelement)
* [findElement](_element_.md#findelement)
* [findElementNameForId](_element_.md#findelementnameforid)
* [findParentName](_element_.md#findparentname)
* [getElement](_element_.md#getelement)
* [getElementAtPath](_element_.md#getelementatpath)
* [getElementAttributes](_element_.md#getelementattributes)
* [getElementFunction](_element_.md#getelementfunction)
* [getElementId](_element_.md#getelementid)
* [getElementIndex](_element_.md#getelementindex)
* [getElementName](_element_.md#getelementname)
* [getInnerElementKeys](_element_.md#getinnerelementkeys)
* [getValueAtPath](_element_.md#getvalueatpath)
* [getValueFromElement](_element_.md#getvaluefromelement)
* [isCatalogElement](_element_.md#iscatalogelement)
* [joinElements](_element_.md#joinelements)
* [mergeAttributes](_element_.md#mergeattributes)
* [mergeElements](_element_.md#mergeelements)
* [mergeWithParent](_element_.md#mergewithparent)
* [reduceElements](_element_.md#reduceelements)

---

## Type aliases

<a id="elementfunctionsmap"></a>

###  ElementFunctionsMap

**ΤElementFunctionsMap**: *`object`*

*Defined in [element.ts:34](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L34)*

Map of element functions used for element parsing.

#### Type declaration

[elementName: `string`]: [ElementFunctions](../interfaces/_element_.elementfunctions.md)

___

## Variables

<a id="attribute_blacklist"></a>

### `<Const>` ATTRIBUTE_BLACKLIST

**● ATTRIBUTE_BLACKLIST**: *`string`[]* =  [ 'default' ]

*Defined in [element.ts:8](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L8)*

___
<a id="element_attribute_key"></a>

### `<Const>` ELEMENT_ATTRIBUTE_KEY

**● ELEMENT_ATTRIBUTE_KEY**: *`string`* = "$"

*Defined in [element.ts:9](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L9)*

___
<a id="element_name_key"></a>

### `<Const>` ELEMENT_NAME_KEY

**● ELEMENT_NAME_KEY**: *`string`* = "$elementName"

*Defined in [element.ts:11](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L11)*

___
<a id="element_text_key"></a>

### `<Const>` ELEMENT_TEXT_KEY

**● ELEMENT_TEXT_KEY**: *`string`* = "_"

*Defined in [element.ts:10](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L10)*

___

## Functions

<a id="buildelement"></a>

###  buildElement

▸ **buildElement**(elementName?: *`string`*, attributes?: *`object`*): `any`

*Defined in [element.ts:39](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L39)*

Build a new empty element.

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Optional` elementName | `string` | - |
| `Default value` attributes | `object` |  {} |

**Returns:** `any`

___
<a id="copyelement"></a>

###  copyElement

▸ **copyElement**(element: *`any`*): `any`

*Defined in [element.ts:124](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L124)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |

**Returns:** `any`

___
<a id="findelement"></a>

###  findElement

▸ **findElement**(elementNames: *`string`[]*, elementId: *`string`*, elementMap: *[ElementMap](_element_map_.md#elementmap)*): `any`

*Defined in [element.ts:115](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L115)*

Find the first element in `elementNames` that has `elementId`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementNames | `string`[] |
| elementId | `string` |
| elementMap | [ElementMap](_element_map_.md#elementmap) |

**Returns:** `any`
element name

___
<a id="findelementnameforid"></a>

###  findElementNameForId

▸ **findElementNameForId**(elementNames: *`string`[]*, elementId: *`string`*, elementMap: *[ElementMap](_element_map_.md#elementmap)*): `string`

*Defined in [element.ts:106](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L106)*

Find the first element name in `elementNames` that has `elementId`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementNames | `string`[] |
| elementId | `string` |
| elementMap | [ElementMap](_element_map_.md#elementmap) |

**Returns:** `string`
element name

___
<a id="findparentname"></a>

###  findParentName

▸ **findParentName**(elementName: *`string`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `string`

*Defined in [element.ts:149](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L149)*

Find the element name that `elementName` starts with. Used for finding parent class name.

Example:

```
findParentName("CEffectAbil", parseData)
```

will return:

```
"CEffect"
```

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementName | `string` |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `string`
`elementName` parent class name

___
<a id="getelement"></a>

###  getElement

▸ **getElement**(elementId: *`string`*, elementName: *`string`*, elementMap: *[ElementMap](_element_map_.md#elementmap)*): `any`[]

*Defined in [element.ts:92](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L92)*

Get list of elements from element map.

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementId | `string` |
| elementName | `string` |
| elementMap | [ElementMap](_element_map_.md#elementmap) |

**Returns:** `any`[]

___
<a id="getelementatpath"></a>

###  getElementAtPath

▸ **getElementAtPath**(element: *`any`*, path: *`string`*, parts?: *`string`[]*): `any`

*Defined in [element.ts:260](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L260)*

Get the element at path.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| element | `any` | - |
| path | `string` | - |  string containing path to access in the element. All parts are separated by `.` |
| `Default value` parts | `string`[] |  null |  **internal use only** |

**Returns:** `any`
element at path or `null` if path is not valid

___
<a id="getelementattributes"></a>

###  getElementAttributes

▸ **getElementAttributes**(element: *`any`*): `any`

*Defined in [element.ts:59](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L59)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |

**Returns:** `any`

___
<a id="getelementfunction"></a>

###  getElementFunction

▸ **getElementFunction**(elementName: *`string`*, functions: *[ElementFunctionsMap](_element_.md#elementfunctionsmap)*, functionName: *`keyof ElementFunctions`*):  `string` &#124; `function` &#124; `function` &#124; `function` &#124; `function` &#124; `function`

*Defined in [element.ts:51](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L51)*

Get function for element name and function name. If the function doesn't exist falls back to the function in `default`

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementName | `string` |
| functions | [ElementFunctionsMap](_element_.md#elementfunctionsmap) |
| functionName | `keyof ElementFunctions` |

**Returns:**  `string` &#124; `function` &#124; `function` &#124; `function` &#124; `function` &#124; `function`

___
<a id="getelementid"></a>

###  getElementId

▸ **getElementId**(element: *`any`*): `any`

*Defined in [element.ts:63](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L63)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |

**Returns:** `any`

___
<a id="getelementindex"></a>

###  getElementIndex

▸ **getElementIndex**(element: *`any`*): `any`

*Defined in [element.ts:67](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L67)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |

**Returns:** `any`

___
<a id="getelementname"></a>

###  getElementName

▸ **getElementName**(element: *`any`*): `any`

*Defined in [element.ts:71](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L71)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |

**Returns:** `any`

___
<a id="getinnerelementkeys"></a>

###  getInnerElementKeys

▸ **getInnerElementKeys**(element: *`any`*): `string`[]

*Defined in [element.ts:85](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L85)*

Get all of the keys for inner elements of the element. Excludes [ELEMENT\_ATTRIBUTE\_KEY](_element_.md#element_attribute_key), [ELEMENT\_NAME\_KEY](_element_.md#element_name_key), [ELEMENT\_TEXT\_KEY](_element_.md#element_text_key).

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |

**Returns:** `string`[]

___
<a id="getvalueatpath"></a>

###  getValueAtPath

▸ **getValueAtPath**(element: *`any`*, path: *`string`*): `any`

*Defined in [element.ts:294](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L294)*

Get value at path. If the last part of the path is an attribute the function will return the value of the element. If the value at the end of the path is an element the value in the `value` attribute will be returned. If the value at the end of the path is an array the value from the first element in the array will be returned.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| element | `any` |
| path | `string` |  string containing path to access in the element. All parts are separated by `.` |

**Returns:** `any`
value at path or `null` if path is not valid

___
<a id="getvaluefromelement"></a>

###  getValueFromElement

▸ **getValueFromElement**(element: *`any`*, attribute?: *`string`*): `any`

*Defined in [element.ts:314](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L314)*

Get value in elmeent. If element is an array with get value from the first element in the array.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| element | `any` | - |
| `Default value` attribute | `string` | &quot;value&quot; |  attribute to get value from element |

**Returns:** `any`
value at path or `null` if path is not valid

___
<a id="iscatalogelement"></a>

###  isCatalogElement

▸ **isCatalogElement**(elementName: *`string`*): `boolean`

*Defined in [element.ts:78](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L78)*

Returns true if the element is a base element. (Exists as a direct child of `Catalog` XML element)

**Parameters:**

| Param | Type |
| ------ | ------ |
| elementName | `string` |

**Returns:** `boolean`

___
<a id="joinelements"></a>

###  joinElements

▸ **joinElements**(elements: *`any`[]*): `any`

*Defined in [element.ts:208](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L208)*

Joins `elements` into a single element. Inner elements are concatted together.

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |

**Returns:** `any`
joined element

___
<a id="mergeattributes"></a>

###  mergeAttributes

▸ **mergeAttributes**(parent: *`any`*, child: *`any`*, filters?: *`string`[]*): `any`

*Defined in [element.ts:195](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L195)*

Merges `parent` with `child` attributes. `child` attributes with overrite `parent` attributes.

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| parent | `any` | - |
| child | `any` | - |
| `Default value` filters | `string`[] |  ATTRIBUTE_BLACKLIST |  list of attirbutes to remove |

**Returns:** `any`
merged attributes

___
<a id="mergeelements"></a>

###  mergeElements

▸ **mergeElements**(parent: *`any`*, child: *`any`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, attributeFilters?: *`string`[]*): `any`

*Defined in [element.ts:240](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L240)*

Merges parent into child. Inner elements are merged with their `merge` functions

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| parent | `any` | - |
| child | `any` | - |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) | - |
| `Default value` attributeFilters | `string`[] |  ATTRIBUTE_BLACKLIST |

**Returns:** `any`
merge element

___
<a id="mergewithparent"></a>

###  mergeWithParent

▸ **mergeWithParent**(element: *`any`*, elementName: *`string`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `any`

*Defined in [element.ts:167](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L167)*

Merges element with all of its parent elements. First merges with element in `parent` attribute. Then checks for default element with no id. Then merges with any parent classes found with [findParentName](_element_.md#findparentname)

**Parameters:**

| Param | Type |
| ------ | ------ |
| element | `any` |
| elementName | `string` |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `any`
merged element

___
<a id="reduceelements"></a>

###  reduceElements

▸ **reduceElements**(elements: *`any`[]*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*): `any`

*Defined in [element.ts:231](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/element.ts#L231)*

Reduces `elements` into a single element by merging all elements.

**Parameters:**

| Param | Type |
| ------ | ------ |
| elements | `any`[] |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) |

**Returns:** `any`
reduced element

___

