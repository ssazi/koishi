import { distance } from 'fastest-levenshtein'
import { Dict, isNullable } from 'cosmokit'
import { fallback, LocaleTree } from '@koishijs/i18n-utils'
import { Context, h, Logger, Schema } from '@satorijs/core'
import zhCN from './locales/zh-CN.yml'
import enUS from './locales/en-US.yml'
import jaJP from './locales/ja-JP.yml'
import frFR from './locales/fr-FR.yml'
import zhTW from './locales/zh-TW.yml'

const logger = new Logger('i18n')
const kTemplate = Symbol('template')

declare module '@satorijs/core' {
  interface Context {
    i18n: I18n
  }

  interface Events {
    'internal/i18n'(): void
  }
}

export interface CompareOptions {
  minSimilarity?: number
}

export namespace I18n {
  export type Node = string | Store

  export interface Store {
    [kTemplate]?: string
    [K: string]: Node
  }

  export type Formatter = (value: any, args: string[], locale: string) => string
  export type Renderer = (dict: Dict, params: any, locale: string) => string

  export interface FindOptions extends CompareOptions {}

  export interface FindResult {
    locale: string
    data: Dict
    similarity: number
  }
}

export class I18n {
  static readonly [Context.expose] = 'i18n'

  _data: Dict<I18n.Store> = {}
  _presets: Dict<I18n.Renderer> = {}

  locales: LocaleTree

  constructor(public ctx: Context, config: I18n.Config) {
    this.locales = LocaleTree.from(config.locales)

    this.define('', { '': '' })
    this.define('zh-CN', zhCN)
    this.define('en-US', enUS)
    this.define('ja-JP', jaJP)
    this.define('fr-FR', frFR)
    this.define('zh-TW', zhTW)
  }

  fallback(locales: string[]) {
    return fallback(this.locales, locales)
  }

  compare(expect: string, actual: string, options: CompareOptions = {}) {
    const value = 1 - distance(expect, actual) / expect.length
    const threshold = options.minSimilarity ?? this.ctx.root.config.minSimilarity
    return value >= threshold ? value : 0
  }

  private* set(locale: string, prefix: string, value: I18n.Node): Generator<string> {
    if (typeof value === 'object' && value && !prefix.includes('@')) {
      for (const key in value) {
        yield* this.set(locale, prefix + key + '.', value[key])
      }
    } else if (prefix.includes('@') || typeof value === 'string') {
      const dict = this._data[locale]
      const [path, preset] = prefix.slice(0, -1).split('@')
      if (preset) {
        value[kTemplate] = preset
        logger.warn('preset is deprecated and will be removed in the future')
      }
      if (!isNullable(dict[path]) && !locale.startsWith('$') && dict[path] !== value) {
        logger.warn('override', locale, path)
      }
      dict[path] = value
      yield path
    } else {
      delete this._data[locale][prefix.slice(0, -1)]
    }
  }

  define(locale: string, dict: I18n.Store): void
  define(locale: string, key: string, value: I18n.Node): void
  define(locale: string, ...args: [I18n.Store] | [string, I18n.Node]) {
    const dict = this._data[locale] ||= {}
    const paths = [...typeof args[0] === 'string'
      ? this.set(locale, args[0] + '.', args[1])
      : this.set(locale, '', args[0])]
    this.ctx.emit('internal/i18n')
    this[Context.current]?.on('dispose', () => {
      for (const path of paths) {
        delete dict[path]
      }
      this.ctx.emit('internal/i18n')
    })
  }

  find(path: string, actual: string, options: I18n.FindOptions = {}): I18n.FindResult[] {
    if (!actual) return []
    const groups: string[] = []
    path = path.replace(/\(([^)]+)\)/g, (_, name) => {
      groups.push(name)
      return '([^.]+)'
    })
    const pattern = new RegExp(`^${path}$`)
    const results: I18n.FindResult[] = []
    for (const locale in this._data) {
      for (const path in this._data[locale]) {
        const capture = pattern.exec(path)
        if (!capture) continue
        const expect = this._data[locale][path]
        if (typeof expect !== 'string') continue
        const similarity = this.compare(expect, actual, options)
        if (!similarity) continue
        const data = {}
        for (let i = 0; i < groups.length; i++) {
          data[groups[i]] = capture[i + 1]
        }
        results.push({ locale, data, similarity })
      }
    }
    return results
  }

  _render(value: I18n.Node, params: any, locale: string) {
    if (value === undefined) return

    if (typeof value !== 'string') {
      const preset = value[kTemplate]
      const render = this._presets[preset]
      if (!render) throw new Error(`Preset "${preset}" not found`)
      return [h.text(render(value, params, locale))]
    }

    return h.parse(value, params)
  }

  /** @deprecated */
  text(locales: string[], paths: string[], params: object) {
    return this.render(locales, paths, params).join('')
  }

  render(locales: string[], paths: string[], params: object) {
    locales = this.fallback(locales)

    // try every locale
    for (const path of paths) {
      for (const locale of locales) {
        for (const key of ['$' + locale, locale]) {
          const value = this._data[key]?.[path]
          if (value === undefined || !value && !locale && path !== '') continue
          return this._render(value, params, locale)
        }
      }
    }

    // path not found
    logger.warn('missing', paths[0])
    return [h.text(paths[0])]
  }
}

export namespace I18n {
  export interface Config {
    locales?: string[]
    output?: 'prefer-user' | 'prefer-channel'
    match?: 'strict' | 'prefer-input' | 'prefer-output'
  }

  export const Config: Schema<Config> = Schema.object({
    locales: Schema.array(String).role('table').default(['zh-CN', 'en-US', 'fr-FR', 'ja-JP', 'de-DE', 'ru-RU']).description('可用的语言列表。按照回退顺序排列。'),
    output: Schema.union([
      Schema.const('prefer-user').description('优先使用用户语言'),
      Schema.const('prefer-channel').description('优先使用频道语言'),
    ]).default('prefer-channel').description('输出语言偏好设置。'),
  }).description('国际化设置')
}

Context.service('i18n', I18n)
