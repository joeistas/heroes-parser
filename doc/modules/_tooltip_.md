[heroes-parser](../README.md) > ["tooltip"](../modules/_tooltip_.md)

# External module: "tooltip"

## Index

### Interfaces

* [TooltipData](../interfaces/_tooltip_.tooltipdata.md)
* [TooltipFormula](../interfaces/_tooltip_.tooltipformula.md)
* [TooltipReference](../interfaces/_tooltip_.tooltipreference.md)
* [TooltipVariable](../interfaces/_tooltip_.tooltipvariable.md)

### Type aliases

* [TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction)
* [TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction)
* [TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction)

### Functions

* [computeTooltipDataFormulas](_tooltip_.md#computetooltipdataformulas)
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

*Defined in [tooltip.ts:49](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L49)*

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

*Defined in [tooltip.ts:48](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L48)*

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

*Defined in [tooltip.ts:50](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L50)*

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

<a id="computetooltipdataformulas"></a>

###  computeTooltipDataFormulas

▸ **computeTooltipDataFormulas**(tooltipData: *`Partial`<[TooltipData](../interfaces/_tooltip_.tooltipdata.md)>*, variableValues?: *`object`*): [TooltipData](../interfaces/_tooltip_.tooltipdata.md)

*Defined in [tooltip.ts:129](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L129)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| tooltipData | `Partial`<[TooltipData](../interfaces/_tooltip_.tooltipdata.md)> | - |
| `Default value` variableValues | `object` |  {} |

**Returns:** [TooltipData](../interfaces/_tooltip_.tooltipdata.md)

___
<a id="handlebarstemplatereplacement"></a>

###  handleBarsTemplateReplacement

▸ **handleBarsTemplateReplacement**(variable: *`string`*): `string`

*Defined in [tooltip.ts:187](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L187)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| variable | `string` |

**Returns:** `string`

___
<a id="parsetooltiplocaletext"></a>

###  parseTooltipLocaleText

▸ **parseTooltipLocaleText**(localeText: *`object`*, parseData: *[ParseData](../interfaces/_parse_data_.parsedata.md)*, formulaElement?: *[TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction)*, templateElement?: *[TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction)*): `Partial`<[TooltipData](../interfaces/_tooltip_.tooltipdata.md)>

*Defined in [tooltip.ts:52](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L52)*

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

▸ **renderTooltipData**(tooltipData: *[TooltipData](../interfaces/_tooltip_.tooltipdata.md)*, render?: *[TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction)*): `object`

*Defined in [tooltip.ts:169](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L169)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| tooltipData | [TooltipData](../interfaces/_tooltip_.tooltipdata.md) | - |
| `Default value` render | [TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction) |  renderTooltipWithHandlebars |

**Returns:** `object`

___
<a id="rendertooltipwithhandlebars"></a>

###  renderTooltipWithHandlebars

▸ **renderTooltipWithHandlebars**(text: *`string`*, formulaResults: *`object`*, tooltipData: *[TooltipData](../interfaces/_tooltip_.tooltipdata.md)*): `string`

*Defined in [tooltip.ts:195](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L195)*

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

*Defined in [tooltip.ts:191](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/tooltip.ts#L191)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| $ | `CheerioStatic` |
| element | `CheerioElement` |

**Returns:** `string`

___

