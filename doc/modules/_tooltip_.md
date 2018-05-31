[heroes-parser](../README.md) > ["tooltip"](../modules/_tooltip_.md)

# External module: "tooltip"

## Index

### Interfaces

* [TooltipData](../interfaces/_tooltip_.tooltipdata.md)
* [TooltipReference](../interfaces/_tooltip_.tooltipreference.md)
* [TooltipVariable](../interfaces/_tooltip_.tooltipvariable.md)

### Type aliases

* [TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction)
* [TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction)
* [TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction)

### Functions

* [handleBarsTemplateReplacement](_tooltip_.md#handlebarstemplatereplacement)
* [parseTooltipLocaleText](_tooltip_.md#parsetooltiplocaletext)
* [renderTooltipData](_tooltip_.md#rendertooltipdata)
* [renderTooltipWithHandlebars](_tooltip_.md#rendertooltipwithhandlebars)
* [toSpanElement](_tooltip_.md#tospanelement)

---

## Type aliases

<a id="tooltipelementreplacefunction"></a>

###  TooltipElementReplaceFunction

**ΤTooltipElementReplaceFunction**: *`function`*

*Defined in [tooltip.ts:44](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L44)*

#### Type declaration
▸($: *`CheerioStatic`*, element: *`CheerioElement`*): `string`

**Parameters:**

| Param | Type |
| ------ | ------ |
| $ | `CheerioStatic` |
| element | `CheerioElement` |

**Returns:** `string`

___
<a id="tooltipformulareplacefunction"></a>

###  TooltipFormulaReplaceFunction

**ΤTooltipFormulaReplaceFunction**: *`function`*

*Defined in [tooltip.ts:43](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L43)*

#### Type declaration
▸(variableName: *`string`*): `string`

**Parameters:**

| Param | Type |
| ------ | ------ |
| variableName | `string` |

**Returns:** `string`

___
<a id="tooltiprenderfunction"></a>

###  TooltipRenderFunction

**ΤTooltipRenderFunction**: *`function`*

*Defined in [tooltip.ts:45](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L45)*

#### Type declaration
▸(text: *`string`*, formulaResults: *`object`*, tooltipData: *[TooltipData](../interfaces/_tooltip_.tooltipdata.md)*): `string`

**Parameters:**

| Param | Type |
| ------ | ------ |
| text | `string` |
| formulaResults | `object` |
| tooltipData | [TooltipData](../interfaces/_tooltip_.tooltipdata.md) |

**Returns:** `string`

___

## Functions

<a id="handlebarstemplatereplacement"></a>

###  handleBarsTemplateReplacement

▸ **handleBarsTemplateReplacement**(variable: *`string`*): `string`

*Defined in [tooltip.ts:157](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L157)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| variable | `string` |

**Returns:** `string`

___
<a id="parsetooltiplocaletext"></a>

###  parseTooltipLocaleText

▸ **parseTooltipLocaleText**(localeText: *`object`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, formulaElement?: *[TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction)*, templateElement?: *[TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction)*): `Partial`<[TooltipData](../interfaces/_tooltip_.tooltipdata.md)>

*Defined in [tooltip.ts:47](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L47)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| localeText | `object` | - |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) | - |
| `Default value` formulaElement | [TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction) |  handleBarsTemplateReplacement |
| `Default value` templateElement | [TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction) |  toSpanElement |

**Returns:** `Partial`<[TooltipData](../interfaces/_tooltip_.tooltipdata.md)>

___
<a id="rendertooltipdata"></a>

###  renderTooltipData

▸ **renderTooltipData**(tooltipData: *[TooltipData](../interfaces/_tooltip_.tooltipdata.md)*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, render?: *[TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction)*, variableValues?: *`object`*): `object`

*Defined in [tooltip.ts:113](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L113)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| tooltipData | [TooltipData](../interfaces/_tooltip_.tooltipdata.md) | - |
| parseData | [ParseData](../interfaces/_parse_data_.parsedata.md) | - |
| `Default value` render | [TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction) |  renderTooltipWithHandlebars |
| `Default value` variableValues | `object` |  {} |

**Returns:** `object`

___
<a id="rendertooltipwithhandlebars"></a>

###  renderTooltipWithHandlebars

▸ **renderTooltipWithHandlebars**(text: *`string`*, formulaResults: *`object`*, tooltipData: *[TooltipData](../interfaces/_tooltip_.tooltipdata.md)*): `string`

*Defined in [tooltip.ts:165](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L165)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| text | `string` |
| formulaResults | `object` |
| tooltipData | [TooltipData](../interfaces/_tooltip_.tooltipdata.md) |

**Returns:** `string`

___
<a id="tospanelement"></a>

###  toSpanElement

▸ **toSpanElement**($: *`CheerioStatic`*, element: *`CheerioElement`*): `string`

*Defined in [tooltip.ts:161](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/tooltip.ts#L161)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| $ | `CheerioStatic` |
| element | `CheerioElement` |

**Returns:** `string`

___

