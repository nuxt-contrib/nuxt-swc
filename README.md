# nuxt-swc

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![license][license-src]][license-href]

Replaces [babel](https://babeljs.io/) with [swc](https://github.com/swc-project/swc) using [swc-loader](https://github.com/swc-project/swc-loader) for [Nuxt](http://nuxtjs.org/).

## Why?

- Faster build (see [benchmarks](https://swc.rs/docs/benchmark-transform))
- Typescript build (transpile-only)

## Current limitations

This module is an experiment. Some features might be broken.

- Check [comparison with babel](https://swc.rs/docs/comparison-babel/)
- Sourcemap is disabled
- Not working with [content module](https://content.nuxtjs.org/)
- Babel options

## Usage

Install `nuxt-swc` as `devDependency` of project:

```sh
yarn add --dev nuxt-swc
# or
npm i -D nuxt-swc
```

Add `nuxt-swc` to `buildModules` in `nuxt.config`:

```js
// nuxt.config
export default {
  buildModules: [
    'nuxt-swc'
  ]
}
```

## Alternatives

- [nuxt-esbuild](https://github.com/galvez/nuxt-esbuild-module)

## 📑 License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://flat.badgen.net/npm/v/nuxt-swc
[npm-version-href]: https://npmjs.com/package/nuxt-swc
[npm-downloads-src]: https://flat.badgen.net/npm/dm/nuxt-swc
[npm-downloads-href]: https://npmjs.com/package/nuxt-swc
[license-src]: https://flat.badgen.net/github/license/pi0/nuxt-swc
[license-href]: https://npmjs.com/package/nuxt-swc
