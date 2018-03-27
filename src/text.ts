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

function addTextToTextMap(text: string, locale: string, textMap: TextMap): void {
  const entries = (text.match(/([^\r\n]+)/g) || []).map(line => line.split('='))

  for(const [ key, value ] of entries) {
    const localeMap = textMap.get(key) || new Map()
    localeMap.set(locale, value)

    textMap.set(key, localeMap)
  }
}

function localeFromFilePath(filePath: string): string {
  const match = filePath.match(/\/(.*).stormdata\//)

  return match ? match[1] : 'enus'
}
