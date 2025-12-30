# react-fathom Examples

This directory contains example Next.js applications demonstrating how to integrate `react-fathom` into your projects.

## Examples

### [next-app](./next-app/)

A Next.js application using the **App Router** (Next.js 13+). This example demonstrates:

- Automatic pageview tracking with `NextFathomTrackViewApp`
- Manual event and goal tracking with the `useFathom` hook
- Integration in `app/layout.tsx`

### [next-pages](./next-pages/)

A Next.js application using the **Pages Router** (traditional Next.js). This example demonstrates:

- Automatic pageview tracking with `NextFathomTrackViewPages`
- Manual event and goal tracking with the `useFathom` hook
- Integration in `pages/_app.tsx`

## Getting Started

Each example is a complete, runnable Next.js application. To get started:

1. Navigate to the example directory:
   ```bash
   cd examples/next-app  # or next-pages
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure your Fathom Analytics site ID:
   - Create a `.env.local` file
   - Add: `NEXT_PUBLIC_FATHOM_SITE_ID=your-site-id-here`
   - Get your site ID from [Fathom Analytics](https://app.usefathom.com)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using Workspace Dependencies

These examples use `workspace:*` to reference the local `react-fathom` package. This allows you to:

- Test changes to `react-fathom` in a real Next.js application
- Verify integration patterns work correctly
- Debug issues in a realistic environment

If you're using npm, you may need to configure workspaces in the root `package.json`. With yarn, workspaces are automatically detected.

## Learn More

- [react-fathom Documentation](../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Fathom Analytics](https://usefathom.com)
