import { createRequire } from 'module'

import { terser } from 'rollup-plugin-terser'

import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const defaultOutputOptions = {
  name: pkg.name,
  exports: 'named',
  globals: {
    'fathom-client': 'Fathom',
    react: 'React',
  },
  banner: `/*! ${pkg.name} - ${pkg.version} !*/`,
  footer: `/* Copyright ${new Date().getFullYear()} - ${pkg.author} */`,
  sourcemap: true,
}

// Babel configuration inline (replaces .babelrc)
const getBabelConfig = () => {
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-import-assertions',
    '@babel/plugin-transform-runtime',
  ]

  if (process.env.NODE_ENV === 'production') {
    plugins.push('babel-plugin-dev-expression')
  }

  return {
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins,
  }
}

// List of Node.js built-in modules to exclude from browser bundles
const nodeBuiltins = [
  'fs',
  'path',
  'os',
  'util',
  'crypto',
  'stream',
  'buffer',
  'events',
  'http',
  'https',
  'net',
  'tls',
  'url',
  'zlib',
  'querystring',
  'child_process',
  'cluster',
  'dgram',
  'dns',
  'module',
  'readline',
  'repl',
  'string_decoder',
  'tty',
  'vm',
  'worker_threads',
]

// Function to check if a module is a Node.js built-in
const isNodeBuiltin = (id) => nodeBuiltins.includes(id)

const defaultPlugins = [
  nodeResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  babel(getBabelConfig()),
  json(),
]

// External function that excludes Node.js built-ins
const makeExternal = (baseExternals) => (id) => {
  if (isNodeBuiltin(id)) {
    return true
  }
  return baseExternals.includes(id)
}

const external = ['fathom-client', 'react']
const nextExternal = [
  'fathom-client',
  'react',
  'next/router',
  'next/navigation',
]

const input = 'src/index.ts'
const nextInput = 'src/next/index.ts'

export default [
  // UMD - Minified
  {
    input,
    output: {
      ...defaultOutputOptions,
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
    },
    external: makeExternal(external),
    plugins: [...defaultPlugins, terser()],
  },
  // UMD
  {
    input,
    output: {
      ...defaultOutputOptions,
      file: `dist/${pkg.name}.js`,
      format: 'umd',
    },
    external: makeExternal(external),
    plugins: [...defaultPlugins],
  },
  // ES - index
  {
    input,
    output: {
      ...defaultOutputOptions,
      dir: 'dist/es',
      format: 'esm',
      entryFileNames: '[name].js',
    },
    external: makeExternal(external),
    plugins: defaultPlugins,
  },
  // CJS - index
  {
    input,
    output: {
      ...defaultOutputOptions,
      dir: 'dist/cjs',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
    external: makeExternal(external),
    plugins: defaultPlugins,
  },
  // ES - next
  {
    input: nextInput,
    output: {
      ...defaultOutputOptions,
      dir: 'dist/es/next',
      format: 'esm',
      entryFileNames: '[name].js',
    },
    external: makeExternal(nextExternal),
    plugins: defaultPlugins,
  },
  // CJS - next
  {
    input: nextInput,
    output: {
      ...defaultOutputOptions,
      dir: 'dist/cjs/next',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
    external: makeExternal(nextExternal),
    plugins: defaultPlugins,
  },
]
