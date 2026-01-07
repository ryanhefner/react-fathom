# Next.js App Router + Fathom Analytics Example

A complete example of integrating privacy-focused analytics into a **Next.js 13+ App Router** application using `react-fathom`.

## Why This Approach?

The Next.js App Router introduces React Server Components, which require special handling for client-side analytics. This example shows the recommended pattern using `NextFathomProviderApp`, a pre-configured Client Component that works seamlessly in Server Component layouts.

## Features Demonstrated

| Feature | Description |
|---------|-------------|
| Automatic Pageview Tracking | Tracks page views on every route change |
| Manual Event Tracking | Track custom events with `useFathom` hook |
| Goal Tracking | Track conversions and goals |
| TypeScript Support | Full type safety throughout |
| Server Component Compatible | Works in `app/layout.tsx` |

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

### Layout Integration (`app/layout.tsx`)

```tsx
import { NextFathomProviderApp } from 'react-fathom/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextFathomProviderApp siteId={process.env.NEXT_PUBLIC_FATHOM_SITE_ID}>
          {children}
        </NextFathomProviderApp>
      </body>
    </html>
  )
}
```

`NextFathomProviderApp` automatically:
- Loads the Fathom script
- Tracks pageviews on route changes
- Provides the `useFathom` hook to all child components

### Event Tracking in Components

```tsx
'use client'

import { useFathom } from 'react-fathom'

export default function MyComponent() {
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
app/
├── layout.tsx      # FathomProvider setup
├── page.tsx        # Home page with event tracking
├── about/
│   └── page.tsx    # Static page (auto pageview tracking)
└── contact/
    └── page.tsx    # Form with event tracking
```

## Learn More

- [react-fathom Documentation](../../README.md)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Fathom Analytics](https://usefathom.com/ref/EKONBS)
