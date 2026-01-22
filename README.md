# react-fathom

[![npm](https://img.shields.io/npm/v/react-fathom?style=flat-square)](https://www.npmjs.com/package/react-fathom)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-fathom?style=flat-square)](https://bundlephobia.com/package/react-fathom)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**Privacy-focused analytics for React, Next.js, and React Native.**

📖 **[Full Documentation](https://react-fathom.com)** · [API Reference](https://react-fathom.com/api/providers) · [Troubleshooting](https://react-fathom.com/troubleshooting)

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
  return <button onClick={() => trackEvent('signup-click')}>Sign Up</button>
}
```

Pageviews are tracked automatically.

## Why react-fathom?

[Fathom Analytics](https://usefathom.com/ref/EKONBS) is a privacy-focused alternative to Google Analytics—no cookies, no consent banners, GDPR compliant by default.

The official `fathom-client` works, but:

| Problem | react-fathom solution |
|---------|----------------------|
| Web only—no React Native | **Full React Native support** with offline event queuing |
| Next.js App Router requires boilerplate | **`NextFathomProviderApp`** works directly in Server Component layouts |
| Imperative API only | **Hooks** (`useFathom`, `useTrackOnMount`, `useTrackOnVisible`) and **declarative components** (`<TrackClick>`, `<TrackVisible>`) |
| No tree-shaking | **Fully tree-shakeable**—bundle only what you use |

**New to Fathom?** Get a **$10 credit** with [this referral link](https://usefathom.com/ref/EKONBS).

## Features

- 🔒 Privacy-first Fathom Analytics integration
- ⚛️ Hooks API and declarative tracking components
- 📱 React Native with offline queuing and navigation tracking
- ⚡ Next.js App Router and Pages Router support
- 🛤️ React Router v6+ and Remix support
- 🏠 Gatsby support with @reach/router integration
- 🌳 Tree-shakeable, fully typed (TypeScript)

## Usage

### Next.js App Router

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

📖 [Full Next.js guide](https://react-fathom.com/nextjs)

### Next.js Pages Router

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
```

📖 [Full Next.js guide](https://react-fathom.com/nextjs)

### React Router / Remix

```tsx
// App.tsx or root.tsx
import { BrowserRouter } from 'react-router-dom'
import { FathomProvider } from 'react-fathom'
import { ReactRouterFathomTrackView } from 'react-fathom/react-router'

function App() {
  return (
    <BrowserRouter>
      <FathomProvider siteId="YOUR_SITE_ID">
        <ReactRouterFathomTrackView />
        <Routes>...</Routes>
      </FathomProvider>
    </BrowserRouter>
  )
}
```

📖 [Full React Router guide](https://react-fathom.com/react-router)

### Gatsby

```tsx
// gatsby-browser.js or Layout component
import { FathomProvider } from 'react-fathom'
import { GatsbyFathomTrackView } from 'react-fathom/gatsby'

export const wrapRootElement = ({ element }) => (
  <FathomProvider siteId="YOUR_SITE_ID">
    <GatsbyFathomTrackView />
    {element}
  </FathomProvider>
)
```

📖 [Full Gatsby guide](https://react-fathom.com/gatsby)

### Hooks

```tsx
import { useFathom, useTrackOnMount, useTrackOnClick, useTrackOnVisible } from 'react-fathom'

function MyComponent() {
  const { trackEvent, trackGoal } = useFathom()

  // Track on mount
  useTrackOnMount({ url: '/custom-page' })

  // Track clicks
  const handleClick = useTrackOnClick({ eventName: 'cta-click', _value: 100 })

  // Track visibility
  const ref = useTrackOnVisible({ eventName: 'hero-viewed' })

  return (
    <>
      <div ref={ref}>Hero section</div>
      <button onClick={handleClick}>Get Started</button>
      <button onClick={() => trackGoal('purchase', 2999)}>Buy Now</button>
    </>
  )
}
```

📖 [Hooks API reference](https://react-fathom.com/api/hooks)

### Declarative Components

```tsx
import { TrackPageview, TrackClick, TrackVisible } from 'react-fathom'

function MyPage() {
  return (
    <>
      <TrackPageview url="/landing" />

      <TrackVisible eventName="section-viewed">
        <section>Tracks when visible</section>
      </TrackVisible>

      <TrackClick eventName="signup-click">
        <button>Sign Up</button>
      </TrackClick>
    </>
  )
}
```

📖 [Components API reference](https://react-fathom.com/api/components)

### React Native

```bash
npm install react-native-webview
```

```tsx
import { NativeFathomProvider } from 'react-fathom/native'

function App() {
  return (
    <NativeFathomProvider
      siteId="YOUR_SITE_ID"
      debug={__DEV__}
      trackAppState
    >
      <YourApp />
    </NativeFathomProvider>
  )
}
```

📖 [Full React Native guide](https://react-fathom.com/react-native)

## API Overview

### Providers

| Component | Use case |
|-----------|----------|
| `FathomProvider` | Basic React apps |
| `NextFathomProviderApp` | Next.js App Router |
| `NextFathomTrackViewPages` | Next.js Pages Router (add inside `FathomProvider`) |
| `ReactRouterFathomTrackView` | React Router v6+ / Remix (add inside `FathomProvider`) |
| `GatsbyFathomTrackView` | Gatsby (add inside `FathomProvider`) |
| `NativeFathomProvider` | React Native |

### Hooks

| Hook | Description |
|------|-------------|
| `useFathom()` | Returns `trackPageview`, `trackEvent`, `trackGoal`, and more |
| `useTrackOnMount(opts?)` | Track pageview when component mounts |
| `useTrackOnClick(opts)` | Returns click handler that tracks event |
| `useTrackOnVisible(opts)` | Returns ref; tracks when element becomes visible |

### Components

| Component | Description |
|-----------|-------------|
| `<TrackPageview>` | Track pageview on mount |
| `<TrackClick>` | Track event on click |
| `<TrackVisible>` | Track when visible (IntersectionObserver) |

📖 [Full API Reference](https://react-fathom.com/api/providers)

## Common Issues

**Events not appearing?**
1. Verify site ID matches your [Fathom dashboard](https://app.usefathom.com)
2. Check for ad blockers (test in incognito)
3. Add `{ includedDomains: ['localhost'] }` to `clientOptions`

**Duplicate pageviews?**
```tsx
// Disable fathom-client's auto tracking when using NextFathomTrackViewApp
<FathomProvider siteId="..." clientOptions={{ auto: false }}>
```

📖 [Full Troubleshooting Guide](https://react-fathom.com/troubleshooting)

## Documentation

- 📖 [Getting Started](https://react-fathom.com/getting-started)
- ⚛️ [React Guide](https://react-fathom.com/react)
- 🛤️ [React Router Guide](https://react-fathom.com/react-router)
- 🏠 [Gatsby Guide](https://react-fathom.com/gatsby)
- ⚡ [Next.js Guide](https://react-fathom.com/nextjs)
- 📱 [React Native Guide](https://react-fathom.com/react-native)
- 📚 [API Reference](https://react-fathom.com/api/providers)
- 🔧 [Troubleshooting](https://react-fathom.com/troubleshooting)
- 🤝 [Contributing](https://react-fathom.com/contributing)

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
