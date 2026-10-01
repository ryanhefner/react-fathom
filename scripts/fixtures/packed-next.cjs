/* eslint-disable @typescript-eslint/no-require-imports -- Exercise the published CommonJS entry points. */
const assert = require('node:assert/strict')
const { JSDOM } = require('jsdom')
const dom = new JSDOM('<div id="root"></div>', {
  url: 'https://example.com/first',
})
global.window = dom.window
global.document = dom.window.document
global.HTMLElement = dom.window.HTMLElement
global.CustomEvent = dom.window.CustomEvent
global.IS_REACT_ACT_ENVIRONMENT = true
Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
})

const React = require('react')
const { createRoot } = require('react-dom/client')
const { FathomProvider } = require('react-fathom')
const {
  NextFathomTrackViewApp,
  NextFathomProviderApp,
} = require('react-fathom/next')
// Use Next's own contexts, not bundled substitutes or mocks.
const {
  PathnameContext,
  SearchParamsContext,
} = require('next/dist/shared/lib/hooks-client-context.shared-runtime.js')
const views = []
const client = {
  trackPageview: (options) => views.push(options.url),
  trackEvent() {},
  trackGoal() {},
  load() {},
  setSite() {},
  blockTrackingForMe() {},
  enableTrackingForMe() {},
  isTrackingEnabled: () => true,
}
const root = createRoot(document.getElementById('root'))
function tree(path, automatic = false) {
  const children = automatic
    ? React.createElement(NextFathomProviderApp, {
        client,
        debug: { enabled: true, console: false },
      })
    : React.createElement(
        FathomProvider,
        { client, debug: { enabled: true, console: false } },
        React.createElement(NextFathomTrackViewApp),
      )
  return React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      PathnameContext.Provider,
      { value: path },
      React.createElement(
        SearchParamsContext.Provider,
        { value: new URLSearchParams() },
        children,
      ),
    ),
  )
}
async function main() {
  await React.act(async () => root.render(tree('/first')))
  assert.deepEqual(views, ['https://example.com/first'])
  await React.act(async () => root.render(tree('/first')))
  assert.equal(views.length, 1)
  await React.act(async () => root.render(tree('/second')))
  await React.act(async () => root.render(tree('/first')))
  assert.deepEqual(views, [
    'https://example.com/first',
    'https://example.com/second',
    'https://example.com/first',
  ])
  await React.act(async () => root.render(tree('/automatic', true)))
  assert.equal(views.at(-1), 'https://example.com/automatic')
  await React.act(async () => root.unmount())
  dom.window.close()
  console.log(
    'ok packed provider/Next context and StrictMode navigation: React ' +
      React.version,
  )
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
