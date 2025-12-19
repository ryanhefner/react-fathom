# 😻 react-fathom

[![npm](https://img.shields.io/npm/v/react-fathom?style=flat-square)](https://www.pkgstats.com/pkg:react-fathom)
[![NPM](https://img.shields.io/npm/l/react-fathom?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/react-fathom?style=flat-square)](https://www.pkgstats.com/pkg:react-fathom)
[![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/react-fathom?style=flat-square)](https://coveralls.io/github/ryanhefner/react-fathom)
[![codecov](https://codecov.io/gh/ryanhefner/react-fathom/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/react-fathom)
[![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/react-fathom?style=flat-square)](https://circleci.com/gh/ryanhefner/react-fathom)
![Known Vulnerabilities](https://snyk.io/test/github/ryanhefner/react-fathom/badge.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/ryanhefner)

Easily compose Fathom Analytics into your React/Next.js apps with automatic pageview tracking and full TypeScript support.

## Features

- 🚀 **Zero-config** Fathom Analytics integration for React
- 📦 **Tree-shakeable** - Only bundle what you use
- 🔄 **Automatic pageview tracking** for Next.js (Pages Router & App Router)
- 💪 **Full TypeScript** support with type definitions
- 🎯 **Flexible** - Works with any React app or Next.js
- ⚡ **Lightweight** - Minimal bundle size impact

## Install

Via [npm](https://npmjs.com/package/react-fathom)

```sh
npm install react-fathom fathom-client
```

Via [Yarn](https://yarn.pm/react-fathom)

```sh
yarn add react-fathom fathom-client
```

## Peer Dependencies

- `react` >= 16.8
- `react-dom` >= 16.8
- `fathom-client` >= 3.0.0
- `next` >= 10.0.0 (only if using Next.js providers)

## Usage

### Basic React Setup

Wrap your app with `FathomProvider`:

```tsx
import { FathomProvider } from 'react-fathom'

function App() {
  return <FathomProvider siteId="YOUR_SITE_ID">{/* Your app */}</FathomProvider>
}
```

### Using the Hook

Access Fathom methods via the `useFathom` hook:

```tsx
import { useFathom } from 'react-fathom'

function MyComponent() {
  const { trackPageview, trackEvent, trackGoal, load } = useFathom()

  const handleClick = () => {
    trackEvent?.('button-click', { id: 'signup-button' })
  }

  const handlePurchase = () => {
    trackGoal?.('purchase', 2999) // $29.99 in cents
  }

  return (
    <>
      <button onClick={handleClick}>Sign Up</button>
      <button onClick={handlePurchase}>Buy Now</button>
    </>
  )
}
```

### Convenience Hooks

Track events and pageviews with convenience hooks:

```tsx
import {
  useTrackOnMount,
  useTrackOnClick,
  useTrackOnVisible,
} from 'react-fathom'

function MyComponent() {
  // Track pageview on mount
  useTrackOnMount({ url: '/custom-page' })

  // Track event on click
  const handleClick = useTrackOnClick({
    eventName: 'button-click',
    id: 'signup-button',
    callback: (e) => {
      console.log('Tracked click!', e)
    },
  })

  // Track event when element becomes visible
  const ref = useTrackOnVisible({
    eventName: 'section-viewed',
    section: 'hero',
    callback: (entry) => {
      console.log('Element is visible!', entry)
    },
  })

  return (
    <>
      <button onClick={handleClick}>Sign Up</button>
      <div ref={ref}>This will be tracked when visible</div>
    </>
  )
}
```

### Declarative Components

Use declarative components for tracking:

```tsx
import { TrackPageview, TrackClick, TrackVisible } from 'react-fathom'

function MyPage() {
  return (
    <>
      {/* Track pageview on mount */}
      <TrackPageview url="/custom-page">
        <div>Page content</div>
      </TrackPageview>

      {/* Track click events */}
      <TrackClick eventName="button-click" id="signup-button">
        <button>Sign Up</button>
      </TrackClick>

      {/* Track when element becomes visible */}
      <TrackVisible eventName="section-viewed" section="hero">
        <div>Hero section</div>
      </TrackVisible>
    </>
  )
}
```

### Next.js App Router

Use `NextFathomProvider` (defaults to App Router) or `NextFathomProviderApp`:

```tsx
// app/layout.tsx
import { NextFathomProvider } from 'react-fathom/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextFathomProvider siteId="YOUR_SITE_ID" router="app">
          {children}
        </NextFathomProvider>
      </body>
    </html>
  )
}
```

Or use the HOC:

```tsx
// app/layout.tsx
import { withAppRouter } from 'react-fathom/next'

function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

export default withAppRouter(RootLayout, {
  siteId: 'YOUR_SITE_ID',
  clientOptions: {
    spa: 'auto',
  },
})
```

### Next.js Pages Router

Use `NextFathomProvider` with `router="pages"` or `NextFathomProviderPages`:

```tsx
// pages/_app.tsx
import { NextFathomProvider } from 'react-fathom/next'

function MyApp({ Component, pageProps }) {
  return (
    <NextFathomProvider siteId="YOUR_SITE_ID" router="pages">
      <Component {...pageProps} />
    </NextFathomProvider>
  )
}

export default MyApp
```

Or use the HOC:

```tsx
// pages/_app.tsx
import { withPagesRouter } from 'react-fathom/next'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withPagesRouter(MyApp, {
  siteId: 'YOUR_SITE_ID',
  clientOptions: {
    spa: 'auto',
  },
})
```

## API

### `FathomProvider`

Main provider component for React apps. Supports composable nesting - nested providers can override `client`, `defaultPageviewOptions`, or `defaultEventOptions`.

**Props:**

- `siteId` (string, optional): Your Fathom Analytics site ID
- `client` (FathomClient, optional): Custom Fathom client instance
- `clientOptions` (LoadOptions, optional): Options passed to `fathom-client`
- `disableDefaultTrack` (boolean, optional): Disable automatic pageview tracking
- `defaultPageviewOptions` (PageViewOptions, optional): Default options merged into all `trackPageview` calls
- `defaultEventOptions` (EventOptions, optional): Default options merged into all `trackEvent` calls

**Example:**

```tsx
<FathomProvider
  siteId="YOUR_SITE_ID"
  defaultPageviewOptions={{ referrer: 'https://example.com' }}
  defaultEventOptions={{ id: 'global-id' }}
>
  {/* Your app */}
</FathomProvider>
```

### `NextFathomProvider`

Unified provider for Next.js that conditionally renders the appropriate router provider.

**Props:**

- All `FathomProvider` props, plus:
- `router` ('app' | 'pages', optional): Router type to use (defaults to 'app')
- `fallback` (ReactNode, optional): Fallback component while loading (defaults to null)
- `disableAutoTrack` (boolean, optional): Disable automatic pageview tracking on route changes
- `trackDefaultOptions` (PageViewOptions, optional): **Deprecated** - Use `defaultPageviewOptions` instead

### `NextFathomProviderApp` / `NextFathomProviderPages`

Next.js-specific providers for App Router and Pages Router respectively.

**Props:**

- All `FathomProvider` props, plus:
- `disableAutoTrack` (boolean, optional): Disable automatic pageview tracking on route changes
- `trackDefaultOptions` (PageViewOptions, optional): **Deprecated** - Use `defaultPageviewOptions` instead

### `useFathom()`

Hook to access Fathom methods and context.

**Returns:**

- `trackPageview(options?)`: Track a pageview (automatically merges `defaultPageviewOptions`)
- `trackEvent(eventName, options?)`: Track a custom event (automatically merges `defaultEventOptions`)
- `trackGoal(code, cents)`: Track a goal conversion
- `load(siteId, options?)`: Load Fathom with a site ID
- `setSite(siteId)`: Change the site ID
- `blockTrackingForMe()`: Block tracking for current user
- `enableTrackingForMe()`: Enable tracking for current user
- `isTrackingEnabled()`: Check if tracking is enabled
- `client`: The Fathom client instance
- `defaultPageviewOptions`: Current default pageview options
- `defaultEventOptions`: Current default event options

### `useTrackOnMount(options?)`

Hook to track a pageview when a component mounts.

**Options:**

- `url` (string, optional): URL to track
- `referrer` (string, optional): Referrer URL
- All other `PageViewOptions` from `fathom-client`

### `useTrackOnClick(options)`

Hook that returns a click handler function to track events.

**Options:**

- `eventName` (string, required): Event name to track
- `preventDefault` (boolean, optional): Whether to prevent default behavior (defaults to false)
- `callback` ((e?: MouseEvent) => void, optional): Callback function to run after tracking
- All other `EventOptions` from `fathom-client`

### `useTrackOnVisible(options)`

Hook that returns a ref to attach to an element. Tracks an event when the element becomes visible.

**Options:**

- `eventName` (string, required): Event name to track
- `callback` ((entry: IntersectionObserverEntry) => void, optional): Callback function to run after tracking
- `threshold` (number, optional): IntersectionObserver threshold (defaults to 0.1)
- `rootMargin` (string, optional): IntersectionObserver rootMargin
- All other `EventOptions` from `fathom-client`

### `TrackPageview`

Component that tracks a pageview when it mounts.

**Props:**

- `url` (string, optional): URL to track
- `referrer` (string, optional): Referrer URL
- `children` (ReactNode, optional): Child elements to render
- All other `PageViewOptions` from `fathom-client`

### `TrackClick`

Component that tracks an event when clicked.

**Props:**

- `eventName` (string, required): Event name to track
- `preventDefault` (boolean, optional): Whether to prevent default behavior (defaults to false)
- `children` (ReactNode, required): Child element(s) to render
- All other `EventOptions` from `fathom-client`

### `TrackVisible`

Component that tracks an event when it becomes visible.

**Props:**

- `eventName` (string, required): Event name to track
- `threshold` (number, optional): IntersectionObserver threshold (defaults to 0.1)
- `rootMargin` (string, optional): IntersectionObserver rootMargin
- `children` (ReactNode, required): Child element(s) to render
- `as` (string, optional): HTML element type to render (defaults to 'div')
- All other `EventOptions` from `fathom-client`

## Tree-shaking

This library is optimized for tree-shaking. When you import only what you need:

```tsx
import { useFathom } from 'react-fathom'
```

Bundlers will automatically exclude unused code, keeping your bundle size minimal.

## TypeScript

Full TypeScript support is included. Types are automatically generated and exported.

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
