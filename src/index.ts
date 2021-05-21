import defu from 'defu'
import { name, version } from '../package.json'

function swcModule () {
  const { nuxt } = this

  const swcOptions = defu(nuxt.options.build.swc, {
    // sync: true,
    sourceMaps: false,
    jsc: {
      parser: {
        dynamicImport: true
      }
    }
  })

  const swcTSOptions = defu(swcOptions, {
    jsc: {
      parser: {
        syntax: 'typescript',
        dynamicImport: true
      }
    }
  })

  nuxt.hook('webpack:config', (configs) => {
    for (const config of configs) {
      config.module.rules = [
        {
          test: /\.m?[jt]sx?$/i,
          use: {
            loader: require.resolve('swc-loader'),
            options: swcOptions
          }
        },
        {
          test: /\.m?[jt]sx?$/i,
          use: {
            loader: require.resolve('swc-loader'),
            options: swcTSOptions
          }
        },
        ...config.module.rules.filter(r => !'.js'.match(r.test))
      ]
    }
  })
}

swcModule.meta = {
  name,
  version
}

export default swcModule
