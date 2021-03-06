/** @hidden */
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

/** @hidden */
export function stringIsNumber(value: string): boolean {
  const n = parseFloat(value)
  return !Number.isNaN(n) && value == n.toString()
}

/** @hidden */
export function splitOnCaps(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
}

/** @hidden */
export function getAtPath(object: any, path: string): any {
  const parts = path.split(".") || [ path ]
  for(const part of parts) {
    object = object[part]
    if(object === null || object === undefined) {
      return null
    }
  }

  return object
}

/** @hidden */
export function setAtPath(object: any, path: string, value: any): boolean {
  const parts = path.split(".") || [ path ]
  for(const part of parts.slice(0, parts.length- 1)) {
    object = object[part]
    if(object === null || object === undefined) {
      return false
    }
  }

  object[parts[parts.length -1]] = value
  return true
}
