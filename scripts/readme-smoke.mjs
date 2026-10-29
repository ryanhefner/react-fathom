import assert from 'node:assert/strict'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

import { extractReadmeExample } from './readme-examples.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const readme = readFileSync(path.join(root, 'README.md'), 'utf8')
const cache = path.join(root, '.cache')
mkdirSync(cache, { recursive: true })
const temporary = mkdtempSync(path.join(cache, 'readme-smoke-'))
try {
  const names = ['react', 'next-app', 'next-pages']
  const sources = new Map(
    names.map((name) => [
      path.join(temporary, `${name}.tsx`),
      extractReadmeExample(readme, name),
    ]),
  )
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    noUnusedLocals: true,
    skipLibCheck: true,
    esModuleInterop: true,
    noEmitOnError: true,
    types: ['node', 'react'],
  }
  const host = ts.createCompilerHost(options)
  const original = host.getSourceFile.bind(host)
  host.getSourceFile = (
    filename,
    languageVersion,
    onError,
    shouldCreateNewSourceFile,
  ) =>
    sources.has(filename)
      ? ts.createSourceFile(
          filename,
          sources.get(filename),
          languageVersion,
          true,
          ts.ScriptKind.TSX,
        )
      : original(filename, languageVersion, onError, shouldCreateNewSourceFile)
  host.writeFile = (filename, contents) => {
    assert.equal(path.dirname(filename), temporary)
    assert.ok(filename.endsWith('.js'))
    writeFileSync(filename.replace(/\.js$/, '.mjs'), contents)
  }
  const program = ts.createProgram([...sources.keys()], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  if (diagnostics.length)
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => root,
        getCanonicalFileName: (filename) => filename,
        getNewLine: () => '\n',
      }),
    )
  assert.equal(program.emit().emitSkipped, false)

  // Rendering to HTML does not run browser effects, load Fathom, or send events.
  // Next examples are typechecked above; their hooks require real router context.
  const { default: App } = await import(
    pathToFileURL(path.join(temporary, 'react.mjs')).href
  )
  const html = renderToStaticMarkup(createElement(App))
  assert.match(html, /<main>/)
  assert.match(html, /<button>Sign up<\/button>/)
  assert.doesNotMatch(html, /<script|undefined|\[object Object\]/)
  console.log(
    'README React/App Router/Pages Router examples typechecked; plain React rendered without analytics requests.',
  )
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
