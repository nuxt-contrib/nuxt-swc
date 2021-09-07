import defu from 'defu'
import { name, version } from '../package.json'
import type { Options } from '@swc/core'
import type { NuxtOptionsBuild } from '@nuxt/types/config/build'

function swcModule () {
  const { nuxt } = this

  const swcOptions: Options = defu(nuxt.options.build.swc, {
    // sync: true,
    sourceMaps: false,
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

  nuxt.options.extensions.push('ts')
  nuxt.options.build.additionalExtensions = ['ts', 'tsx']

  nuxt.hook('webpack:config', (configs) => {
    for (const config of configs) {
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
