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

For React Native apps, use the dedicated `/native` export which includes a pre-built client with offline support:

```tsx
import { NativeFathomProvider } from 'react-fathom/native'

function App() {
  return (
    <NativeFathomProvider
      siteId="YOUR_SITE_ID"
      clientOptions={{ debug: __DEV__ }}
      trackAppState
    >
      <YourApp />
    </NativeFathomProvider>
  )
}
```

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

#### Creating a Custom Native Client

For advanced use cases, create your own native client:

```tsx
import { createNativeClient, FathomProvider } from 'react-fathom/native'

const client = createNativeClient({
  siteId: 'YOUR_SITE_ID',
  debug: __DEV__,
  enableOfflineQueue: true,
  maxQueueSize: 100,
  timeout: 10000,
})

function App() {
  return (
    <FathomProvider client={client}>
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

The `/native` export provides React Native-specific components and hooks.

### `NativeFathomProvider`

Convenience provider for React Native apps that creates and manages a native Fathom client automatically.

**Props:**

- `siteId` (string, required): Your Fathom Analytics site ID
- `clientOptions` (NativeClientOptions, optional): Configuration for the native client
- `defaultPageviewOptions` (PageViewOptions, optional): Default options merged into all `trackPageview` calls
- `defaultEventOptions` (EventOptions, optional): Default options merged into all `trackEvent` calls
- `trackAppState` (boolean, optional): Enable automatic app state tracking (defaults to false)
- `children` (ReactNode, required): Child components to render

**Example:**

```tsx
<NativeFathomProvider
  siteId="YOUR_SITE_ID"
  clientOptions={{ debug: __DEV__, enableOfflineQueue: true }}
  trackAppState
>
  <App />
</NativeFathomProvider>
```

### `createNativeClient(options)`

Factory function to create a custom native Fathom client.

**Options (NativeClientOptions):**

- `siteId` (string, required): Your Fathom Analytics site ID
- `apiEndpoint` (string, optional): Custom API endpoint (defaults to Fathom's collect endpoint)
- `enableOfflineQueue` (boolean, optional): Enable offline request queuing (defaults to true)
- `maxQueueSize` (number, optional): Maximum events to queue when offline (defaults to 100)
- `customHeaders` (Record<string, string>, optional): Custom headers for requests
- `debug` (boolean, optional): Enable debug logging (defaults to false)
- `userAgent` (string, optional): Custom user agent string
- `timeout` (number, optional): Request timeout in milliseconds (defaults to 10000)

**Returns:** A `FathomClient` instance with additional methods:

- `processQueue()`: Manually process queued events (returns Promise<number>)
- `getQueueLength()`: Get the current queue length

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

1. **Check your site ID** - Ensure `YOUR_SITE_ID` matches the ID in your Fathom dashboard
2. **Ad blockers** - Some ad blockers block analytics scripts. Test in an incognito window with extensions disabled
3. **Development mode** - Fathom may not track localhost by default. Add your development domain to Fathom's allowed domains, or use the `includedDomains` option
4. **Check the console** - Enable debug mode to see tracking calls:
   ```tsx
   <FathomProvider siteId="YOUR_SITE_ID" clientOptions={{ auto: false }}>
   ```

#### "useFathom must be used within a FathomProvider" error

Ensure your component is wrapped in a `FathomProvider`:

```tsx
// Correct
<FathomProvider siteId="YOUR_SITE_ID">
  <MyComponent /> {/* useFathom works here */}
</FathomProvider>

// Incorrect - MyComponent is outside the provider
<MyComponent />
<FathomProvider siteId="YOUR_SITE_ID">...</FathomProvider>
```

#### Next.js App Router: "use client" errors

When using `FathomProvider` directly in a Server Component (like `app/layout.tsx`), use `NextFathomProviderApp` instead which is pre-configured as a Client Component:

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

#### React Native: Events not sending

1. **Check network connectivity** - Events are queued when offline and sent when connectivity is restored
2. **Process the queue manually** - Use `client.processQueue()` to force-send queued events
3. **Check queue length** - Use `client.getQueueLength()` to see pending events

### Getting Help

- [Open an issue](https://github.com/ryanhefner/react-fathom/issues) on GitHub
- Check [existing issues](https://github.com/ryanhefner/react-fathom/issues?q=is%3Aissue) for solutions

## Contributing

Contributions are welcome! Here's how you can help:

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ryanhefner/react-fathom.git
   cd react-fathom
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Build the package:
   ```bash
   npm run build
   ```

### Testing with Examples

The `examples/` directory contains Next.js applications for testing:

```bash
cd examples/next-app
npm install
npm run dev
```

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Submit a pull request

Please follow the existing code style and include tests for new features.

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
