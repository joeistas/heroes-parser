export function filterKeysFromObject(object: any, keyFilters: string[]) {
  const filterSet = new Set(keyFilters)
  const output: any = {}

  for(const key of Object.keys(object)) {
    if(filterSet.has(key)) {
      continue
    }

    output[key] = object[key]
  }

  return output
}

export function stringIsNumber(value: string): boolean {
  const n = parseInt(value)
  return !Number.isNaN(n) && value == n.toString()
}
