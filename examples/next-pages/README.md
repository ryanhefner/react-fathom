# Next.js Pages Router Example

This is an example Next.js application using the **Pages Router** with `react-fathom` for analytics tracking.

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

   - Create a `.env.local` file in the root directory
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

The integration is set up in `pages/_app.tsx`:

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

That's it! Pageviews are automatically tracked when users navigate between pages.

## Testing

- Navigate between pages to see automatic pageview tracking
- Click the "Track Event" button on the home page to test event tracking
- Click the "Track Goal" button to test goal tracking
- Submit the contact form to see event tracking in action

## Learn More

- [react-fathom Documentation](../../README.md)
- [Next.js Pages Router Documentation](https://nextjs.org/docs/pages)
- [Fathom Analytics](https://usefathom.com)
