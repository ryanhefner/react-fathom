# react-fathom

[![npm](https://img.shields.io/npm/v/react-fathom?style=flat-square)](https://www.pkgstats.com/pkg:react-fathom)
[![NPM](https://img.shields.io/npm/l/react-fathom?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/react-fathom?style=flat-square)](https://www.pkgstats.com/pkg:react-fathom)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-fathom?style=flat-square)](https://bundlephobia.com/package/react-fathom)
[![GitHub stars](https://img.shields.io/github/stars/ryanhefner/react-fathom?style=flat-square)](https://github.com/ryanhefner/react-fathom/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![codecov](https://codecov.io/gh/ryanhefner/react-fathom/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/react-fathom)

**Privacy-focused analytics for React, Next.js, and React Native.** Easily integrate [Fathom Analytics](https://usefathom.com/ref/EKONBS) into your applications with automatic pageview tracking, custom event tracking, and full TypeScript support.

## Table of Contents

- [Quick Start](#quick-start)
- [Why react-fathom?](#why-react-fathom)
- [Features](#features)
- [Installation](#install)
- [Usage](#usage)
  - [Basic React Setup](#basic-react-setup)
  - [Next.js App Router](#nextjs-app-router)
  - [Next.js Pages Router](#nextjs-pages-router)
  - [React Native](#react-native)
- [API Reference](#api)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

```bash
npm install react-fathom fathom-client
```

```tsx
// App.tsx or layout.tsx
import { FathomProvider } from 'react-fathom'

function App() {
  return (
    <FathomProvider siteId="YOUR_FATHOM_SITE_ID">
      <YourApp />
    </FathomProvider>
  )
}
```

```tsx
// Any component
import { useFathom } from 'react-fathom'

function MyComponent() {
  const { trackEvent } = useFathom()

  return (
    <button onClick={() => trackEvent('button-click')}>
      Click me
    </button>
  )
}
```

That's it! Pageviews are tracked automatically.

## Why react-fathom?

### Privacy-First Analytics

[Fathom Analytics](https://usefathom.com/ref/EKONBS) is a privacy-focused alternative to Google Analytics. Unlike traditional analytics platforms:

- **No cookies required** - GDPR, CCPA, and PECR compliant out of the box
- **No personal data collection** - Respects user privacy by design
- **No consent banners needed** - Simplified compliance for your websites
- **Fast and lightweight** - Won't slow down your site

### Why Use This Package?

- **React-native integration** - Works seamlessly with React's component model and hooks
- **Automatic tracking** - Pageviews tracked automatically on route changes
- **Next.js optimized** - First-class support for both App Router and Pages Router
- **React Native support** - Full mobile support with offline queuing
- **TypeScript-first** - Complete type definitions for a great developer experience
- **Tree-shakeable** - Only bundle what you use

**New to Fathom?** Get a **$10 credit** when you sign up using [this referral link](https://usefathom.com/ref/EKONBS).

## Features

- 🚀 **Zero-config** Fathom Analytics integration for React
- 📦 **Tree-shakeable** - Only bundle what you use
- 🔄 **Automatic pageview tracking** for Next.js (Pages Router & App Router)
- 📱 **React Native support** with offline queuing and navigation tracking
- 💪 **Full TypeScript** support with type definitions
- 🎯 **Flexible** - Works with any React app, Next.js, or React Native
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
- `react-dom` >= 16.8 (only if using web)
- `fathom-client` >= 3.0.0 (only if using web, not needed for React Native)
- `next` >= 10.0.0 (only if using Next.js providers)
- `react-native` >= 0.60.0 (only if using React Native)
- `react-native-webview` >= 11.0.0 (only if using React Native)

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
    trackEvent('button-click', { _value: 100 }) // Optional: value in cents
  }

  const handlePurchase = () => {
    trackGoal('purchase', 2999) // $29.99 in cents
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
    _value: 100, // Optional: value in cents
    callback: (e) => {
      console.log('Tracked click!', e)
    },
  })

  // Track event when element becomes visible
  const ref = useTrackOnVisible({
    eventName: 'section-viewed',
    _value: 1, // Optional: value in cents
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
      <TrackClick eventName="button-click" _value={100}>
        <button>Sign Up</button>
      </TrackClick>

      {/* Track when element becomes visible */}
      <TrackVisible eventName="section-viewed" _value={1}>
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

## Default Options Merging

The `FathomProvider` supports setting default options that automatically merge with any options passed to tracking calls. This is useful for setting app-wide defaults like custom event IDs or referrer information.

### How Merging Works

Default options are spread first, then any options you pass to individual tracking calls are spread second. This means:

- **Default options** provide base values for all tracking calls
- **Provided options** override defaults when specified
- You can set defaults once and forget about them

```tsx
<FathomProvider
  siteId="YOUR_SITE_ID"
  defaultEventOptions={{ _site_id: 'my-app' }}
>
  {/* All trackEvent calls will include _site_id: 'my-app' unless overridden */}
</FathomProvider>
```

```tsx
// Inside your component
const { trackEvent } = useFathom()

// Uses default: { _site_id: 'my-app' }
trackEvent('button-click')

// Merges with default: { _site_id: 'my-app', _value: 100 }
trackEvent('purchase', { _value: 100 })

// Overrides default: { _site_id: 'custom-site', _value: 50 }
trackEvent('special-event', { _site_id: 'custom-site', _value: 50 })
```

### Nested Providers

When nesting `FathomProvider` components, child providers inherit defaults from their parent but can override them:

```tsx
<FathomProvider
  siteId="YOUR_SITE_ID"
  defaultEventOptions={{ _site_id: 'global' }}
>
  {/* Events here use _site_id: 'global' */}

  <FathomProvider defaultEventOptions={{ _site_id: 'dashboard' }}>
    {/* Events here use _site_id: 'dashboard' */}
  </FathomProvider>
</FathomProvider>
```

## Custom Client Implementation

The `FathomProvider` accepts an optional `client` prop that allows you to provide a custom Fathom client implementation. This is useful for:

- **React Native apps** that need a custom tracking implementation
- **Testing** with mock clients
- **Server-side rendering** scenarios
- **Custom analytics pipelines** that wrap Fathom

### FathomClient Interface

Your custom client must implement the `FathomClient` interface:

```tsx
import type { FathomClient, EventOptions, LoadOptions, PageViewOptions } from 'react-fathom'

const myCustomClient: FathomClient = {
  load: (siteId: string, options?: LoadOptions) => {
    // Initialize your tracking
  },
  trackPageview: (opts?: PageViewOptions) => {
    // Track pageview
  },
  trackEvent: (eventName: string, opts?: EventOptions) => {
    // Track custom event
  },
  trackGoal: (code: string, cents: number) => {
    // Track goal conversion
  },
  setSite: (id: string) => {
    // Change site ID
  },
  blockTrackingForMe: () => {
    // Block tracking
  },
  enableTrackingForMe: () => {
    // Enable tracking
  },
  isTrackingEnabled: () => {
    // Return tracking status
    return true
  },
}
```

### React Native

For React Native apps, use the dedicated `/native` export. This uses a hidden WebView to load Fathom's official tracking script, ensuring full compatibility with Fathom Analytics.

**Install the required peer dependency:**

```bash
npm install react-native-webview
# or
yarn add react-native-webview
```

**Basic setup:**

```tsx
import { NativeFathomProvider } from 'react-fathom/native'

function App() {
  return (
    <NativeFathomProvider
      siteId="YOUR_SITE_ID"
      debug={__DEV__}
      trackAppState
      onReady={() => console.log('Fathom ready!')}
    >
      <YourApp />
    </NativeFathomProvider>
  )
}
```

> **Note:** The provider renders a hidden WebView (0x0 pixels) that loads the Fathom script. Events are queued until the WebView is ready, then automatically sent.

#### React Navigation Integration

Track screen navigation as pageviews with React Navigation:

```tsx
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import { NativeFathomProvider, useNavigationTracking } from 'react-fathom/native'

function App() {
  const navigationRef = useNavigationContainerRef()

  return (
    <NativeFathomProvider siteId="YOUR_SITE_ID">
      <NavigationContainer ref={navigationRef}>
        <NavigationTracker navigationRef={navigationRef} />
        <RootNavigator />
      </NavigationContainer>
    </NativeFathomProvider>
  )
}

function NavigationTracker({ navigationRef }) {
  useNavigationTracking({
    navigationRef,
    transformRouteName: (name) => `/screens/${name}`,
  })
  return null
}
```

#### App State Tracking

Track when users foreground/background your app:

```tsx
import { useAppStateTracking } from 'react-fathom/native'

function AppTracker() {
  useAppStateTracking({
    foregroundEventName: 'app-resumed',
    backgroundEventName: 'app-paused',
    onStateChange: (state) => console.log('App state:', state),
  })
  return null
}
```

#### Using Custom Domains

If you use [Fathom's custom domains feature](https://usefathom.com/docs/script/custom-domains), specify your domain:

```tsx
<NativeFathomProvider
  siteId="YOUR_SITE_ID"
  scriptDomain="your-custom-domain.com"
>
  <YourApp />
</NativeFathomProvider>
```

#### Advanced: Manual WebView Client Setup

For advanced use cases, you can manually set up the WebView client:

```tsx
import { useRef, useMemo, useCallback } from 'react'
import {
  FathomWebView,
  createWebViewClient,
  FathomProvider,
  type FathomWebViewRef,
} from 'react-fathom/native'

function App() {
  const webViewRef = useRef<FathomWebViewRef>(null)

  const client = useMemo(
    () => createWebViewClient(() => webViewRef.current, { debug: __DEV__ }),
    []
  )

  const handleReady = useCallback(() => {
    client.setWebViewReady()
  }, [client])

  return (
    <FathomProvider client={client} siteId="YOUR_SITE_ID">
      <FathomWebView
        ref={webViewRef}
        siteId="YOUR_SITE_ID"
        onReady={handleReady}
      />
      <YourApp />
    </FathomProvider>
  )
}
```

### Mock Client for Testing

```tsx
import { FathomProvider, type FathomClient } from 'react-fathom'

const mockClient: FathomClient = {
  load: jest.fn(),
  trackPageview: jest.fn(),
  trackEvent: jest.fn(),
  trackGoal: jest.fn(),
  setSite: jest.fn(),
  blockTrackingForMe: jest.fn(),
  enableTrackingForMe: jest.fn(),
  isTrackingEnabled: jest.fn(() => true),
}

// In your tests
render(
  <FathomProvider client={mockClient}>
    <ComponentUnderTest />
  </FathomProvider>
)

// Assert tracking calls
expect(mockClient.trackEvent).toHaveBeenCalledWith('button-click', { _value: 100 })
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
  defaultEventOptions={{ _site_id: 'global-site' }}
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

## Native API

The `/native` export provides React Native-specific components and hooks. It uses a hidden WebView to load Fathom's official tracking script, ensuring full compatibility with Fathom Analytics (both Fathom Pro and self-hosted Fathom Lite).

### `NativeFathomProvider`

Convenience provider for React Native apps that manages a hidden WebView with Fathom's tracking script.

**Props:**

- `siteId` (string, required): Your Fathom Analytics site ID
- `loadOptions` (LoadOptions, optional): Options passed to `fathom.load()` in the WebView
- `scriptDomain` (string, optional): Custom domain for Fathom script (defaults to 'cdn.usefathom.com')
- `defaultPageviewOptions` (PageViewOptions, optional): Default options merged into all `trackPageview` calls
- `defaultEventOptions` (EventOptions, optional): Default options merged into all `trackEvent` calls
- `trackAppState` (boolean, optional): Enable automatic app state tracking (defaults to false)
- `debug` (boolean, optional): Enable debug logging (defaults to false)
- `onReady` (() => void, optional): Called when the Fathom script has loaded
- `onError` ((error: string) => void, optional): Called when an error occurs loading the script
- `children` (ReactNode, required): Child components to render

**Example:**

```tsx
<NativeFathomProvider
  siteId="YOUR_SITE_ID"
  debug={__DEV__}
  trackAppState
  onReady={() => console.log('Analytics ready!')}
  onError={(err) => console.error('Analytics error:', err)}
>
  <App />
</NativeFathomProvider>
```

### `FathomWebView`

Hidden WebView component that loads and manages the Fathom Analytics script. Used internally by `NativeFathomProvider`, but can be used directly for advanced setups.

**Props:**

- `siteId` (string, required): Your Fathom Analytics site ID
- `loadOptions` (LoadOptions, optional): Options passed to `fathom.load()`
- `scriptDomain` (string, optional): Custom domain for Fathom script (defaults to 'cdn.usefathom.com')
- `onReady` (() => void, optional): Called when the Fathom script has loaded
- `onError` ((error: string) => void, optional): Called when an error occurs
- `debug` (boolean, optional): Enable debug logging (defaults to false)

**Ref Methods (FathomWebViewRef):**

- `trackPageview(opts?)`: Track a pageview
- `trackEvent(eventName, opts?)`: Track a custom event
- `trackGoal(code, cents)`: Track a goal conversion
- `blockTrackingForMe()`: Block tracking for current user
- `enableTrackingForMe()`: Enable tracking for current user
- `isReady()`: Check if the WebView is ready

### `createWebViewClient(getWebViewRef, options?)`

Factory function to create a client that communicates with a FathomWebView.

**Parameters:**

- `getWebViewRef` (() => FathomWebViewRef | null): Function that returns the WebView ref
- `options` (WebViewClientOptions, optional):
  - `debug` (boolean): Enable debug logging (defaults to false)
  - `enableQueue` (boolean): Enable command queuing before WebView is ready (defaults to true)
  - `maxQueueSize` (number): Maximum commands to queue (defaults to 100)

**Returns:** A `FathomClient` instance with additional methods:

- `processQueue()`: Manually process queued commands (returns number of processed)
- `getQueueLength()`: Get the current queue length
- `setWebViewReady()`: Call when WebView signals it's ready (flushes queue)

### `useAppStateTracking(options?)`

Hook that tracks app state changes (foreground/background) as Fathom events.

**Options:**

- `foregroundEventName` (string, optional): Event name for foreground (defaults to 'app-foreground')
- `backgroundEventName` (string, optional): Event name for background (defaults to 'app-background')
- `eventOptions` (EventOptions, optional): Additional options for app state events
- `onStateChange` ((state: 'active' | 'background' | 'inactive') => void, optional): Callback on state change

### `useNavigationTracking(options)`

Hook that tracks React Navigation screen changes as pageviews.

**Options:**

- `navigationRef` (RefObject, required): React Navigation container ref
- `transformRouteName` ((name: string) => string, optional): Transform route names before tracking
- `shouldTrackRoute` ((name: string, params?: object) => boolean, optional): Filter which routes to track
- `includeParams` (boolean, optional): Include route params in tracked URL (defaults to false)

**Example:**

```tsx
const navigationRef = useNavigationContainerRef()

useNavigationTracking({
  navigationRef,
  transformRouteName: (name) => `/app/${name.toLowerCase()}`,
  shouldTrackRoute: (name) => !name.startsWith('Modal'),
  includeParams: true,
})
```

## Tree-shaking

This library is optimized for tree-shaking. When you import only what you need:

```tsx
import { useFathom } from 'react-fathom'
```

Bundlers will automatically exclude unused code, keeping your bundle size minimal.

## TypeScript

Full TypeScript support is included. Types are automatically generated and exported.

### Exported Types

For convenience, `react-fathom` re-exports the core types from `fathom-client` so you don't need to import from multiple packages:

```tsx
import type {
  // From react-fathom
  FathomClient,
  FathomContextInterface,
  FathomProviderProps,
  // Re-exported from fathom-client
  EventOptions,
  LoadOptions,
  PageViewOptions,
} from 'react-fathom'

// No need for this anymore:
// import type { EventOptions } from 'fathom-client'
```

This simplifies your imports when building custom clients or working with typed event options.

## Troubleshooting

### Common Issues

#### Events not appearing in Fathom dashboard

**1. Verify your site ID**

Your site ID should match exactly what's shown in your [Fathom dashboard](https://app.usefathom.com). It's typically an 8-character alphanumeric string like `ABCD1234`.

```tsx
// Double-check this value
<FathomProvider siteId="ABCD1234">
```

**2. Check for ad blockers**

Many ad blockers and privacy extensions block analytics scripts. To test:
- Open an incognito/private window with extensions disabled
- Or temporarily whitelist your development domain

**3. Domain restrictions**

Fathom only tracks events from domains you've configured. For local development:

```tsx
<FathomProvider
  siteId="YOUR_SITE_ID"
  clientOptions={{
    includedDomains: ['localhost', 'yourdomain.com']
  }}
>
```

**4. Inspect network requests**

Open your browser's Network tab and look for requests to `cdn.usefathom.com`. If you see:
- **No requests**: The script isn't loading (check provider setup)
- **Blocked requests**: Ad blocker is interfering
- **Failed requests**: Check your site ID and domain configuration

#### Duplicate pageview tracking

If you're seeing double pageviews, you likely have multiple tracking setups:

```tsx
// WRONG: Both auto tracking AND manual tracking
<FathomProvider siteId="YOUR_SITE_ID">
  <NextFathomTrackViewApp /> {/* This tracks pageviews */}
  {/* AND clientOptions.auto defaults to true, which also tracks */}
</FathomProvider>

// CORRECT: Use one or the other
<FathomProvider siteId="YOUR_SITE_ID" clientOptions={{ auto: false }}>
  <NextFathomTrackViewApp />
</FathomProvider>
```

#### useFathom returns undefined methods

This was the old behavior. As of the latest version, `useFathom()` returns stub methods that warn in development when called outside a provider. If you're seeing `undefined`:

1. Update to the latest version: `npm update react-fathom`
2. Ensure your component is inside a `FathomProvider`

#### Next.js App Router: "use client" errors

Server Components can't use hooks directly. Use the pre-configured client component:

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

If you need a custom setup, create your own client component wrapper:

```tsx
// components/AnalyticsProvider.tsx
'use client'
import { FathomProvider } from 'react-fathom'

export function AnalyticsProvider({ children }) {
  return (
    <FathomProvider siteId={process.env.NEXT_PUBLIC_FATHOM_SITE_ID}>
      {children}
    </FathomProvider>
  )
}
```

#### Next.js: Environment variables not loading

Ensure your environment variable is prefixed with `NEXT_PUBLIC_` to be available client-side:

```bash
# .env.local
NEXT_PUBLIC_FATHOM_SITE_ID=YOUR_SITE_ID  # ✓ Correct
FATHOM_SITE_ID=YOUR_SITE_ID               # ✗ Won't work client-side
```

#### React Native: Events not sending

**1. Verify react-native-webview is installed**

The native module requires `react-native-webview`:

```bash
npm install react-native-webview
# For iOS, also run:
cd ios && pod install
```

**2. Check WebView is ready**

Events are queued until the WebView loads. Use the `onReady` callback to verify:

```tsx
<NativeFathomProvider
  siteId="YOUR_SITE_ID"
  debug={true}
  onReady={() => console.log('Fathom WebView ready!')}
  onError={(err) => console.error('Fathom error:', err)}
>
```

**3. Verify network connectivity**

The WebView needs network access to load the Fathom script. Events are queued before the WebView is ready but won't send if the script fails to load.

**4. Check for WebView restrictions**

Some enterprise MDM solutions or app configurations may block WebViews from loading external scripts. Verify that `cdn.usefathom.com` (or your custom domain) is accessible.

**5. Debug with logging**

Enable debug mode to see all tracking activity:

```tsx
<NativeFathomProvider
  siteId="YOUR_SITE_ID"
  debug={__DEV__}  // Logs all tracking calls
>
```

### Debugging Tips

#### Enable verbose logging

For web, check the browser console. For React Native, enable debug mode:

```tsx
// React Native
<NativeFathomProvider
  siteId="YOUR_SITE_ID"
  debug={__DEV__}
>
```

#### Verify tracking in real-time

Fathom's dashboard updates in real-time. Open your dashboard alongside your app to see events as they're tracked.

#### Test with a mock client

For debugging, replace the real client with a mock that logs everything:

```tsx
const debugClient = {
  load: (id, opts) => console.log('load:', id, opts),
  trackPageview: (opts) => console.log('pageview:', opts),
  trackEvent: (name, opts) => console.log('event:', name, opts),
  trackGoal: (code, cents) => console.log('goal:', code, cents),
  setSite: (id) => console.log('setSite:', id),
  blockTrackingForMe: () => console.log('blocked'),
  enableTrackingForMe: () => console.log('enabled'),
  isTrackingEnabled: () => true,
}

<FathomProvider client={debugClient}>
```

### Getting Help

- [Open an issue](https://github.com/ryanhefner/react-fathom/issues) on GitHub
- [Search existing issues](https://github.com/ryanhefner/react-fathom/issues?q=is%3Aissue) for solutions
- [Fathom Analytics documentation](https://usefathom.com/docs) for platform-specific questions

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, documentation improvements, or examples, we appreciate your help.

### Ways to Contribute

| Type | Description |
|------|-------------|
| **Bug Reports** | Found a bug? [Open an issue](https://github.com/ryanhefner/react-fathom/issues/new) with reproduction steps |
| **Feature Requests** | Have an idea? Discuss it in an issue first |
| **Bug Fixes** | PRs for documented issues are always welcome |
| **Documentation** | Help improve docs, add examples, fix typos |
| **Tests** | Increase test coverage or add edge case tests |

### Development Setup

**Prerequisites:**
- Node.js 18+
- npm 9+

**1. Clone and install:**

```bash
git clone https://github.com/ryanhefner/react-fathom.git
cd react-fathom
npm install
```

**2. Run the development workflow:**

```bash
# Run tests in watch mode during development
npm run test:watch

# Run the full test suite
npm test

# Build the package
npm run build

# Type check without emitting
npm run typecheck
```

### Project Structure

```
react-fathom/
├── src/
│   ├── index.ts              # Main entry point
│   ├── FathomProvider.tsx    # Core provider component
│   ├── FathomContext.tsx     # React context
│   ├── types.ts              # TypeScript definitions
│   ├── hooks/                # React hooks
│   │   ├── useFathom.ts
│   │   ├── useTrackOnClick.ts
│   │   ├── useTrackOnMount.ts
│   │   └── useTrackOnVisible.ts
│   ├── components/           # Declarative tracking components
│   │   ├── TrackClick.tsx
│   │   ├── TrackPageview.tsx
│   │   └── TrackVisible.tsx
│   ├── next/                 # Next.js-specific exports
│   │   └── index.ts
│   └── native/               # React Native exports
│       ├── index.ts
│       ├── FathomWebView.tsx
│       ├── createWebViewClient.ts
│       ├── NativeFathomProvider.tsx
│       ├── useNavigationTracking.ts
│       └── useAppStateTracking.ts
├── examples/                 # Example applications
│   ├── next-app/            # Next.js App Router example
│   └── next-pages/          # Next.js Pages Router example
└── dist/                    # Built output (generated)
```

### Testing Guidelines

We use [Vitest](https://vitest.dev/) for testing. All new features should include tests.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Writing tests:**

```tsx
// src/hooks/useMyHook.test.tsx
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useMyHook } from './useMyHook'
import { FathomProvider } from '../FathomProvider'

describe('useMyHook', () => {
  it('should track events correctly', () => {
    const mockClient = {
      trackEvent: vi.fn(),
      // ... other required methods
    }

    const wrapper = ({ children }) => (
      <FathomProvider client={mockClient}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useMyHook(), { wrapper })

    result.current.doSomething()

    expect(mockClient.trackEvent).toHaveBeenCalledWith('expected-event', {})
  })
})
```

### Code Style

- **TypeScript**: All code should be fully typed
- **Formatting**: We use Prettier (run `npm run format` before committing)
- **Linting**: ESLint catches common issues (run `npm run lint`)
- **Naming**:
  - Components: PascalCase (`TrackClick.tsx`)
  - Hooks: camelCase with `use` prefix (`useFathom.ts`)
  - Types: PascalCase (`FathomClient`)

### Submitting a Pull Request

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b fix/my-bug-fix
   # or
   git checkout -b feature/my-new-feature
   ```
3. **Make your changes** with clear, focused commits
4. **Add or update tests** for your changes
5. **Ensure CI passes**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```
6. **Submit a PR** with a clear description of what and why

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
feat: add useTrackOnScroll hook for scroll tracking
fix: resolve duplicate pageview tracking in Next.js
docs: add troubleshooting section for ad blockers
test: add tests for native offline queue
refactor: simplify FathomContext default values
```

Prefixes: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
