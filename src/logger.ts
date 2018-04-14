import { ParseOptions } from './parse-options'

export interface Logger {
  info: (...args: any[]) => void
  debug: (...args: any[]) => void
  error: (...args: any[]) => void
  group: (level?: 'info' | 'debug') => void
  groupEnd: (level?: 'info' | 'debug') => void
}

export let LOGGER: Logger

export function buildLogger(options: ParseOptions): Logger {
  LOGGER = {
    info: options.logLevel === 'none' ? () => null : options.console.info,
    debug: options.logLevel !== 'debug' ? () => null : options.console.debug,
    error: options.console.error,
    group: (level: string = 'debug'): void => {
      if(options.logLevel === 'none' || (options.logLevel === 'info' && level === 'debug')) {
        return
      }

      options.console.group()
    },
    groupEnd: (level: string = 'debug'): void => {
      if(options.logLevel === 'none' || (options.logLevel === 'info' && level === 'debug')) {
        return
      }

      options.console.groupEnd()
    },
  }

  return LOGGER
}
