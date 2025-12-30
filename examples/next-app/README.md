# Next.js App Router Example

This is an example Next.js application using the **App Router** with `react-fathom` for analytics tracking.

## Features Demonstrated

- ✅ Automatic pageview tracking on route changes
- ✅ Manual event tracking with `useFathom` hook
- ✅ Goal tracking
- ✅ TypeScript support

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Fathom Analytics:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Fathom Analytics site ID:
     ```
     NEXT_PUBLIC_FATHOM_SITE_ID=your-site-id-here
     ```
   - Get your site ID from [Fathom Analytics](https://app.usefathom.com)

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Integration

The integration is set up in `app/layout.tsx` using `NextFathomProviderApp`, which is a client component wrapper that combines `FathomProvider` and `NextFathomTrackViewApp`:

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

That's it! Pageviews are automatically tracked when users navigate between pages.

> **Note:** `NextFathomProviderApp` is marked with `'use client'` and can be used directly in Server Components like the root layout. This makes it the recommended approach for App Router integrations.

## Testing

- Navigate between pages to see automatic pageview tracking
- Click the "Track Event" button on the home page to test event tracking
- Click the "Track Goal" button to test goal tracking
- Submit the contact form to see event tracking in action

## Learn More

- [react-fathom Documentation](../../README.md)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Fathom Analytics](https://usefathom.com)
