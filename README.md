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
  const { trackPageview, trackEvent, load } = useFathom()

  const handleClick = () => {
    trackEvent?.('button-click', { id: 'signup-button' })
  }

  return <button onClick={handleClick}>Sign Up</button>
}
```

### Next.js Pages Router

Use `PagesRouterProvider` for automatic route tracking:

```tsx
// pages/_app.tsx
import { PagesRouterProvider } from 'react-fathom/next'

function MyApp({ Component, pageProps }) {
  return (
    <PagesRouterProvider siteId="YOUR_SITE_ID">
      <Component {...pageProps} />
    </PagesRouterProvider>
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

### Next.js App Router

Use `AppRouterProvider` for automatic route tracking:

```tsx
// app/layout.tsx
import { AppRouterProvider } from 'react-fathom/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppRouterProvider siteId="YOUR_SITE_ID">{children}</AppRouterProvider>
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

## API

### `FathomProvider`

Main provider component for React apps.

**Props:**

- `siteId` (string, required): Your Fathom Analytics site ID
- `client` (FathomClient, optional): Custom Fathom client instance
- `clientOptions` (LoadOptions, optional): Options passed to `fathom-client`
- `disableDefaultTrack` (boolean, optional): Disable automatic pageview tracking
- `trackDefaultOptions` (PageViewOptions, optional): Default options for pageview tracking

### `PagesRouterProvider` / `AppRouterProvider`

Next.js-specific providers with automatic route tracking.

**Props:**

- All `FathomProvider` props, plus:
- `disableAutoTrack` (boolean, optional): Disable automatic pageview tracking on route changes
- `trackDefaultOptions` (PageViewOptions, optional): Default options for route change pageviews

### `useFathom()`

Hook to access Fathom methods.

**Returns:**

- `trackPageview(options?)`: Track a pageview
- `trackEvent(eventName, options?)`: Track a custom event
- `load(siteId, options?)`: Load Fathom with a site ID
- `setSite(siteId)`: Change the site ID
- `blockTrackingForMe()`: Block tracking for current user
- `enableTrackingForMe()`: Enable tracking for current user
- `isTrackingEnabled()`: Check if tracking is enabled

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
