# 😻 react-fathom

[![npm](https://img.shields.io/npm/v/react-fathom?style=flat-square)](https://www.pkgstats.com/pkg:react-fathom)
[![NPM](https://img.shields.io/npm/l/react-fathom?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/react-fathom?style=flat-square)](https://www.pkgstats.com/pkg:react-fathom)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-fathom?style=flat-square)](https://bundlephobia.com/package/react-fathom)
[![GitHub stars](https://img.shields.io/github/stars/ryanhefner/react-fathom?style=flat-square)](https://github.com/ryanhefner/react-fathom/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ryanhefner/react-fathom?style=flat-square)](https://github.com/ryanhefner/react-fathom/network/members)
[![GitHub issues](https://img.shields.io/github/issues/ryanhefner/react-fathom?style=flat-square)](https://github.com/ryanhefner/react-fathom/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/ryanhefner/react-fathom?style=flat-square)](https://github.com/ryanhefner/react-fathom/pulls)
[![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/react-fathom?style=flat-square)](https://coveralls.io/github/ryanhefner/react-fathom)
[![codecov](https://codecov.io/gh/ryanhefner/react-fathom/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/react-fathom)
[![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/react-fathom?style=flat-square)](https://circleci.com/gh/ryanhefner/react-fathom)
[![Known Vulnerabilities](https://snyk.io/test/github/ryanhefner/react-fathom/badge.svg)](https://snyk.io/test/github/ryanhefner/react-fathom)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![GitHub last commit](https://img.shields.io/github/last-commit/ryanhefner/react-fathom?style=flat-square)](https://github.com/ryanhefner/react-fathom/commits/main)
[![Twitter Follow](https://img.shields.io/twitter/follow/ryanhefner?style=flat-square)](https://twitter.com/ryanhefner)

Easily compose Fathom Analytics into your React/Next.js apps with automatic pageview tracking and full TypeScript support.

## About Fathom Analytics

This package is designed to work with [Fathom Analytics](https://usefathom.com/ref/EKONBS), a privacy-first website analytics platform. Fathom provides simple, GDPR-compliant analytics without cookies or tracking scripts that invade user privacy.

**New to Fathom?** Get a **$10 credit** on your first invoice when you sign up using [this affiliate link](https://usefathom.com/ref/EKONBS). This helps support the development of this open-source package.

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

**Recommended:** Use `NextFathomProviderApp` for easy integration in App Router layouts:

```tsx
// app/layout.tsx
import { NextFathomProviderApp } from 'react-fathom/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextFathomProviderApp siteId="YOUR_SITE_ID">
          {children}
        </NextFathomProviderApp>
      </body>
    </html>
  )
}
```

**Alternative:** You can also use `FathomProvider` with `NextFathomTrackViewApp` separately if you need more control:

```tsx
// app/layout.tsx
import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewApp } from 'react-fathom/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FathomProvider siteId="YOUR_SITE_ID">
          <NextFathomTrackViewApp />
          {children}
        </FathomProvider>
      </body>
    </html>
  )
}
```

> **Note:** Since `FathomProvider` uses React hooks, you'll need to wrap it in a Client Component when using it directly in a Server Component layout. `NextFathomProviderApp` handles this for you automatically.

### Next.js Pages Router

Use `FathomProvider` with `NextFathomTrackViewPages` for automatic route tracking:

```tsx
// pages/_app.tsx
import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewPages } from 'react-fathom/next'

function MyApp({ Component, pageProps }) {
  return (
    <FathomProvider siteId="YOUR_SITE_ID">
      <NextFathomTrackViewPages />
      <Component {...pageProps} />
    </FathomProvider>
  )
}

export default MyApp
```

## API

### `FathomProvider`

Main provider component for React apps. Supports composable nesting - nested providers can override `client`, `defaultPageviewOptions`, or `defaultEventOptions`.

**Props:**

- `siteId` (string, optional): Your Fathom Analytics site ID
- `client` (FathomClient, optional): Custom Fathom client instance
- `clientOptions` (LoadOptions, optional): Options passed to `fathom-client`
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

### `NextFathomProviderApp`

Client component wrapper that combines `FathomProvider` and `NextFathomTrackViewApp` for easy integration in Next.js App Router layouts. This component is marked with `'use client'` and can be used directly in Server Components like the root `layout.tsx` file.

**Props:**

- `siteId` (string, optional): Your Fathom Analytics site ID
- `client` (FathomClient, optional): Custom Fathom client instance
- `clientOptions` (LoadOptions, optional): Options passed to `fathom-client`
- `defaultPageviewOptions` (PageViewOptions, optional): Default options merged into all `trackPageview` calls
- `defaultEventOptions` (EventOptions, optional): Default options merged into all `trackEvent` calls
- `disableAutoTrack` (boolean, optional): Disable automatic pageview tracking on route changes (defaults to false)
- `children` (ReactNode, required): Child components to render

**Example:**

```tsx
// app/layout.tsx
import { NextFathomProviderApp } from 'react-fathom/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextFathomProviderApp siteId="YOUR_SITE_ID">
          {children}
        </NextFathomProviderApp>
      </body>
    </html>
  )
}
```

### `NextFathomTrackViewApp`

Component that tracks pageviews for Next.js App Router. Must be used within a `FathomProvider`.

**Props:**

- `disableAutoTrack` (boolean, optional): Disable automatic pageview tracking on route changes (defaults to false)

**Example:**

```tsx
<FathomProvider siteId="YOUR_SITE_ID">
  <NextFathomTrackViewApp />
  {/* Your app */}
</FathomProvider>
```

### `NextFathomTrackViewPages`

Component that tracks pageviews for Next.js Pages Router. Must be used within a `FathomProvider`.

**Props:**

- `disableAutoTrack` (boolean, optional): Disable automatic pageview tracking on route changes (defaults to false)

**Example:**

```tsx
<FathomProvider siteId="YOUR_SITE_ID">
  <NextFathomTrackViewPages />
  {/* Your app */}
</FathomProvider>
```

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
