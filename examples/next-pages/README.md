# Next.js Pages Router + Fathom Analytics Example

A complete example of integrating privacy-focused analytics into a **Next.js Pages Router** application using `react-fathom`.

## Why This Approach?

The Pages Router is the traditional Next.js routing system using the `pages/` directory. This example demonstrates the recommended pattern for adding Fathom Analytics to existing Pages Router applications or new projects that prefer this routing approach.

## Features Demonstrated

| Feature | Description |
|---------|-------------|
| Automatic Pageview Tracking | Tracks page views on every route change |
| Manual Event Tracking | Track custom events with `useFathom` hook |
| Goal Tracking | Track conversions and goals |
| TypeScript Support | Full type safety throughout |
| Router Event Integration | Uses Next.js router events for tracking |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Fathom

Create `.env.local`:

```
NEXT_PUBLIC_FATHOM_SITE_ID=your-site-id-here
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it in action.

## How It Works

### App Integration (`pages/_app.tsx`)

```tsx
import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewPages } from 'react-fathom/next'

export default function App({ Component, pageProps }) {
  return (
    <FathomProvider siteId={process.env.NEXT_PUBLIC_FATHOM_SITE_ID}>
      <NextFathomTrackViewPages />
      <Component {...pageProps} />
    </FathomProvider>
  )
}
```

This setup:
- `FathomProvider` - Initializes Fathom and provides context to all pages
- `NextFathomTrackViewPages` - Listens to Next.js router events and tracks pageviews automatically

### Event Tracking in Pages

```tsx
import { useFathom } from 'react-fathom'

export default function MyPage() {
  const { trackEvent, trackGoal } = useFathom()

  return (
    <>
      <button onClick={() => trackEvent('button-click')}>
        Track Event
      </button>
      <button onClick={() => trackGoal('SIGNUP', 0)}>
        Track Goal
      </button>
    </>
  )
}
```

## File Structure

```
pages/
├── _app.tsx        # FathomProvider setup
├── index.tsx       # Home page with event tracking
├── about.tsx       # Static page (auto pageview tracking)
└── contact.tsx     # Form with event tracking
```

## Migrating to App Router?

If you're planning to migrate to the App Router, check out the [next-app example](../next-app/) for the updated integration pattern using `NextFathomProviderApp`.

## Learn More

- [react-fathom Documentation](../../README.md)
- [Next.js Pages Router Guide](https://nextjs.org/docs/pages)
- [Fathom Analytics](https://usefathom.com/ref/EKONBS)
