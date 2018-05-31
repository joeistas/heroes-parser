/** @hidden */
export const LINE_REGEXP = /([^\r\n]+)/g
const KEY_VALUE_REGEXP = /(.*?)=(.*)/

export type LocaleTextMap = Map<string, string>

/**
  Map containing all of the text from parsed text files

  Structure:

    Text key ->

      locale -> text
 */
export type TextMap = Map<string, LocaleTextMap>

/** @hidden */
export function buildTextMap(fileData: [string, string][]): TextMap {
  const textMap: TextMap = new Map()
  for(const [ filePath, text ] of fileData) {
    const locale = localeFromFilePath(filePath)
    addTextToTextMap(text, locale, textMap)
  }

  return textMap
}

/** @hidden */
export function addTextToTextMap(text: string, locale: string, textMap: TextMap): void {
  const lineRegExp = new RegExp(LINE_REGEXP)
  let lineMatch
  while((lineMatch = lineRegExp.exec(text)) !== null) {
    const line = lineMatch[1]
    if(!line || line === '') {
      continue
    }

    const match = KEY_VALUE_REGEXP.exec(line)
    if(!match) {
      continue
    }

    const [ key, value ] = [ match[1], match[2] ]

    const localeMap = textMap.get(key) || new Map()
    localeMap.set(locale, value)
    textMap.set(key, localeMap)
  }
}

export function localeFromFilePath(filePath: string): string {
  const match = filePath.match(/\/(.{4}).stormdata\//)

  return !match ? 'base' : match[1]
}
