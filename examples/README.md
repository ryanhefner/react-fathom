# react-fathom Examples

This directory contains example applications demonstrating how to integrate `react-fathom` for privacy-focused analytics in your React projects.

## Available Examples

| Example | Framework | Router | Description |
|---------|-----------|--------|-------------|
| [next-app](./next-app/) | Next.js 13+ | App Router | Modern Next.js with React Server Components |
| [next-pages](./next-pages/) | Next.js | Pages Router | Traditional Next.js routing |

## Which Example Should I Use?

- **Starting a new Next.js project?** Use [next-app](./next-app/) - the App Router is the recommended approach for new Next.js applications
- **Existing Next.js project with Pages Router?** Use [next-pages](./next-pages/) - works with the traditional `pages/` directory structure
- **Plain React or other frameworks?** Check the main [README](../README.md) for generic React setup instructions

## Getting Started

### 1. Navigate to an example

```bash
cd examples/next-app  # or next-pages
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure your Fathom site ID

Create a `.env.local` file:

```bash
NEXT_PUBLIC_FATHOM_SITE_ID=your-site-id-here
```

Get your site ID from [Fathom Analytics](https://app.usefathom.com). New to Fathom? [Sign up here](https://usefathom.com/ref/EKONBS) and get $10 credit.

### 4. Start the development server

```bash
npm run dev
```

### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000) and explore the example.

## What's Demonstrated

Each example demonstrates:

- **Automatic pageview tracking** - Navigate between pages to see tracking in action
- **Manual event tracking** - Click buttons to track custom events
- **Goal tracking** - Track conversions and goals
- **TypeScript integration** - Full type safety

## Development Notes

These examples use `workspace:*` to reference the local `react-fathom` package, making them ideal for:

- Testing changes to the library
- Debugging integration issues
- Exploring different configuration options

## Learn More

- [react-fathom Documentation](../README.md)
- [Fathom Analytics Documentation](https://usefathom.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
