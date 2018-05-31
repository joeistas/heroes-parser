[heroes-parser](../README.md) > ["parsers/text-parsers"](../modules/_parsers_text_parsers_.md)

# External module: "parsers/text-parsers"

## Index

### Functions

* [attributeValueReplacement](_parsers_text_parsers_.md#attributevaluereplacement)
* [parseTooltip](_parsers_text_parsers_.md#parsetooltip)
* [renderTooltip](_parsers_text_parsers_.md#rendertooltip)
* [replaceWithLocaleText](_parsers_text_parsers_.md#replacewithlocaletext)

---

## Functions

<a id="attributevaluereplacement"></a>

###  attributeValueReplacement

▸ **attributeValueReplacement**(attribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/text-parsers.ts:27](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/text-parsers.ts#L27)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="parsetooltip"></a>

###  parseTooltip

▸ **parseTooltip**(attribute?: *`string`*, formulaElement?: *[TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction)*, templateElement?: *[TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction)*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/text-parsers.ts:70](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/text-parsers.ts#L70)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` formulaElement | [TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction) |  handleBarsTemplateReplacement |
| `Default value` templateElement | [TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction) |  toSpanElement |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="rendertooltip"></a>

###  renderTooltip

▸ **renderTooltip**(attribute?: *`string`*, render?: *[TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction)*): `(Anonymous function)`

*Defined in [parsers/text-parsers.ts:87](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/text-parsers.ts#L87)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` render | [TooltipRenderFunction](_tooltip_.md#tooltiprenderfunction) |  renderTooltipWithHandlebars |

**Returns:** `(Anonymous function)`

___
<a id="replacewithlocaletext"></a>

###  replaceWithLocaleText

▸ **replaceWithLocaleText**(attribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/text-parsers.ts:48](https://github.com/joeistas/heroes-parser/blob/ad5aa01/src/parsers/text-parsers.ts#L48)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___

