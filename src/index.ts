import defu from 'defu'
import { ModuleThis } from '@nuxt/types/config/module'
import { name, version } from '../package.json'
import type { Options } from '@swc/core'
import type { NuxtOptionsBuild } from '@nuxt/types/config/build'

const defaultTargets = {
  server: { node: 12 },
  client: { ie: 9 },
  modern: {
    chrome: 60,
    firefox: 54
  }
}

function swcModule (this: ModuleThis) {
  this.options.extensions.push('ts')
  this.options.build.additionalExtensions = ['ts', 'tsx']

  // Auto detect corejs version:
  // https://github.com/nuxt/nuxt.js/tree/dev/packages/webpack/src/config/base.js#L124-L132
  let coreJs: string
  if (this.options.build.corejs === 'auto') {
    try {
      coreJs = require('core-js/package.json').version.split('.')[0]
    } catch (_err) {
      coreJs = '2'
    }
  } else {
    coreJs = String(this.options.build.corejs)
  }

  this.nuxt.hook('webpack:config', (configs) => {
    for (const config of configs) {
      const swcOptions: Options = defu(this.options.build.swc, {
        // sync: true,
        sourceMaps: false,
        minify: this.options.build.optimization?.minimize ?? (!this.options.dev && config.name !== 'server'),
        env: {
          coreJs,
          targets: defaultTargets[config.name]
        },
        jsc: {
          parser: {
            dynamicImport: true
          }
        }
      } as Options)

      const swcTSOptions = defu(swcOptions, {
        jsc: {
          parser: {
            syntax: 'typescript'
          }
        }
      } as Options)
      config.resolve!.extensions!.push('.ts', '.tsx')
      config.module.rules = [
        ...config.module.rules.filter(r => '.vue'.match(r.test)),
        {
          test: /\.m?jsx?$/i,
          use: {
            loader: require.resolve('swc-loader'),
            options: swcOptions
          }
        },
        {
          test: /\.tsx?$/i,
          use: {
            loader: require.resolve('swc-loader'),
            options: swcTSOptions
          }
        },
        ...config.module.rules.filter(r => !('.js'.match(r.test) || '.vue'.match(r.test)))
      ]
    }
  })
}

swcModule.meta = {
  name,
  version
}

export default swcModule

declare module '@nuxt/types/config/build' {
  interface NuxtOptionsBuild {
    swc?: Options
  }
}

declare module '@nuxt/types' {
  interface NuxtOptions {
    build: NuxtOptionsBuild
  }
}
