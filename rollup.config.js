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

const defaultPlugins = [
  nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
  commonjs(),
  babel(getBabelConfig()),
  json(),
]

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
    external,
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
    external,
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
    external,
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
    external,
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
    external: nextExternal,
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
    external: nextExternal,
    plugins: defaultPlugins,
  },
]
