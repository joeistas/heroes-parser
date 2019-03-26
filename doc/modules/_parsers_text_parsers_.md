[heroes-parser](../README.md) > ["parsers/text-parsers"](../modules/_parsers_text_parsers_.md)

# External module: "parsers/text-parsers"

## Index

### Functions

* [attributeValueReplacement](_parsers_text_parsers_.md#attributevaluereplacement)
* [parseTooltip](_parsers_text_parsers_.md#parsetooltip)
* [replaceWithLocaleText](_parsers_text_parsers_.md#replacewithlocaletext)

---

## Functions

<a id="attributevaluereplacement"></a>

###  attributeValueReplacement

▸ **attributeValueReplacement**(attribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/text-parsers.ts:17](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/text-parsers.ts#L17)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="parsetooltip"></a>

###  parseTooltip

▸ **parseTooltip**(attribute?: *`string`*, formulaElement?: *[TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction)*, templateElement?: *[TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction)*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/text-parsers.ts:59](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/text-parsers.ts#L59)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |
| `Default value` formulaElement | [TooltipFormulaReplaceFunction](_tooltip_.md#tooltipformulareplacefunction) |  handleBarsTemplateReplacement |
| `Default value` templateElement | [TooltipElementReplaceFunction](_tooltip_.md#tooltipelementreplacefunction) |  toSpanElement |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="replacewithlocaletext"></a>

###  replaceWithLocaleText

▸ **replaceWithLocaleText**(attribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/text-parsers.ts:38](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/parsers/text-parsers.ts#L38)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` attribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___

