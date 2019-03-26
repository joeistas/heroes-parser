[heroes-parser](../README.md) > ["formatters/key-formatters"](../modules/_formatters_key_formatters_.md)

# External module: "formatters/key-formatters"

## Index

### Variables

* [defaultKeyFormatter](_formatters_key_formatters_.md#defaultkeyformatter)

### Functions

* [join](_formatters_key_formatters_.md#join)
* [lowerCaseFirstCharacter](_formatters_key_formatters_.md#lowercasefirstcharacter)
* [pluralizeKey](_formatters_key_formatters_.md#pluralizekey)
* [removeArrayFromKey](_formatters_key_formatters_.md#removearrayfromkey)

---

## Variables

<a id="defaultkeyformatter"></a>

### `<Const>` defaultKeyFormatter

**● defaultKeyFormatter**: *[ElementKeyFormatter](_formatters_index_.md#elementkeyformatter)* =  join(
  removeArrayFromKey,
  lowerCaseFirstCharacter,
)

*Defined in [formatters/key-formatters.ts:8](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/formatters/key-formatters.ts#L8)*

___

## Functions

<a id="join"></a>

###  join

▸ **join**(...formatters: *[ElementKeyFormatter](_formatters_index_.md#elementkeyformatter)[]*): [ElementKeyFormatter](_formatters_index_.md#elementkeyformatter)

*Defined in [formatters/key-formatters.ts:25](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/formatters/key-formatters.ts#L25)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Rest` formatters | [ElementKeyFormatter](_formatters_index_.md#elementkeyformatter)[] |

**Returns:** [ElementKeyFormatter](_formatters_index_.md#elementkeyformatter)

___
<a id="lowercasefirstcharacter"></a>

###  lowerCaseFirstCharacter

▸ **lowerCaseFirstCharacter**(key: *`string`*): `string`

*Defined in [formatters/key-formatters.ts:17](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/formatters/key-formatters.ts#L17)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `string`

___
<a id="pluralizekey"></a>

###  pluralizeKey

▸ **pluralizeKey**(key: *`string`*): `string`

*Defined in [formatters/key-formatters.ts:21](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/formatters/key-formatters.ts#L21)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `string`

___
<a id="removearrayfromkey"></a>

###  removeArrayFromKey

▸ **removeArrayFromKey**(key: *`string`*): `string`

*Defined in [formatters/key-formatters.ts:13](https://github.com/joeistas/heroes-parser/blob/be29d1f/src/formatters/key-formatters.ts#L13)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `string`

___

