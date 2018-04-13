import * as pluralize from 'pluralize'

import {
  ElementFormatter,
  ElementKeyFormatter,
} from './'

export const defaultKeyFormatter: ElementKeyFormatter = join(
  removeArrayFromKey,
  lowerCaseFirstCharacter,
)

export function removeArrayFromKey(key: string): string {
  return key.replace('Array', '')
}

export function lowerCaseFirstCharacter(key: string): string {
  return key[0].toLowerCase() + key.substring(1)
}

export function pluralizeKey(key: string) {
  return pluralize(key)
}

export function join(...formatters: ElementKeyFormatter[]): ElementKeyFormatter {
  return (key: string): string => {
    let formattedKey = key
    for(const formatter of formatters) {
      formattedKey = formatter(formattedKey)
      if(formattedKey === null) {
        return key
      }
    }

    return formattedKey
  }
}
