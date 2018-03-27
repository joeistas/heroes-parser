export type LocaleTextMap = Map<string, string>
export type TextMap = Map<string, LocaleTextMap>

export function buildTextMap(fileData: [string, string][]): TextMap {
  const textMap: TextMap = new Map()

  for(const [ filePath, text ] of fileData) {
    const locale = localeFromFilePath(filePath)
    addTextToTextMap(text, locale, textMap)
  }

  return textMap
}

export function addTextToTextMap(text: string, locale: string, textMap: TextMap): void {
  const entries = (text.match(/([^\r\n]+)/g) || []).map(line => line.split('='))

  const localeMap = textMap.get(locale) || new Map()
  for(const [ key, value ] of entries) {
    localeMap.set(key, value)
  }

  textMap.set(locale, localeMap)
}

export function localeFromFilePath(filePath: string): string {
  const match = filePath.match(/\/(.{4}).stormdata\//)

  return (!match || match[1] === 'base') ? 'enus' : match[1]
}
