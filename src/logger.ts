import { ParseOptions } from './parse-options'

export interface Logger {
  info: (...args: any[]) => void
  debug: (...args: any[]) => void
  error: (...args: any[]) => void
  group: (level?: 'info' | 'debug') => void
  groupEnd: (level?: 'info' | 'debug') => void
}

let LOGGER: Logger

export function buildLogger(logger: Logger = console, logLevel: string = 'info'): Logger {
  LOGGER = {
    info: logLevel === 'none' ? () => null : logger.info,
    debug: logLevel !== 'debug' ? () => null : logger.debug,
    error: logger.error,
    group: (level: string = 'debug'): void => {
      if(logLevel === 'none' || (logLevel === 'info' && level === 'debug')) {
        return
      }

      logger.group()
    },
    groupEnd: (level: string = 'debug'): void => {
      if(logLevel === 'none' || (logLevel === 'info' && level === 'debug')) {
        return
      }

      logger.groupEnd()
    },
  }

  return LOGGER
}

export function getLogger(): Logger {
  return LOGGER
}
