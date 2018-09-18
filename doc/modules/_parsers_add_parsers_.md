[heroes-parser](../README.md) > ["parsers/add-parsers"](../modules/_parsers_add_parsers_.md)

# External module: "parsers/add-parsers"

## Index

### Functions

* [addAttribute](_parsers_add_parsers_.md#addattribute)
* [addInnerElement](_parsers_add_parsers_.md#addinnerelement)
* [attributesToInnerElements](_parsers_add_parsers_.md#attributestoinnerelements)

---

## Functions

<a id="addattribute"></a>

###  addAttribute

▸ **addAttribute**(name: *`string`*, value: *`string`*, override?: *`boolean`*): `(Anonymous function)`

*Defined in [parsers/add-parsers.ts:15](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parsers/add-parsers.ts#L15)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| name | `string` | - |
| value | `string` | - |
| `Default value` override | `boolean` | false |

**Returns:** `(Anonymous function)`

___
<a id="addinnerelement"></a>

###  addInnerElement

▸ **addInnerElement**(attribute: *`string`*, key: *`string`*, innerAttribute?: *`string`*, innerName?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/add-parsers.ts:24](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parsers/add-parsers.ts#L24)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| attribute | `string` | - |
| key | `string` | - |
| `Default value` innerAttribute | `string` | &quot;value&quot; |
| `Optional` innerName | `string` | - |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___
<a id="attributestoinnerelements"></a>

###  attributesToInnerElements

▸ **attributesToInnerElements**(regexp: *`RegExp`*, innerAttribute?: *`string`*): [ElementParser](_parsers_index_.md#elementparser)

*Defined in [parsers/add-parsers.ts:47](https://github.com/joeistas/heroes-parser/blob/3b278f6/src/parsers/add-parsers.ts#L47)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| regexp | `RegExp` | - |
| `Default value` innerAttribute | `string` | &quot;value&quot; |

**Returns:** [ElementParser](_parsers_index_.md#elementparser)

___

