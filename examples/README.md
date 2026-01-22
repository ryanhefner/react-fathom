# react-fathom Examples

This directory contains example applications demonstrating how to integrate `react-fathom` for privacy-focused analytics in your React projects.

## Live Demos

Each example is hosted as a subdomain of react-fathom.com:

| Example | Live Demo | Description |
|---------|-----------|-------------|
| React | [react.react-fathom.com](https://react.react-fathom.com) | Standard React with Vite and React Router |
| Next.js App Router | [next-app.react-fathom.com](https://next-app.react-fathom.com) | Modern Next.js with Server Components |
| Next.js Pages Router | [next-pages.react-fathom.com](https://next-pages.react-fathom.com) | Traditional Next.js routing |

## Available Examples

| Example | Framework | Router | Description |
|---------|-----------|--------|-------------|
| [react](./react/) | React + Vite | React Router | Standard React SPA |
| [next-app](./next-app/) | Next.js 13+ | App Router | Modern Next.js with React Server Components |
| [next-pages](./next-pages/) | Next.js | Pages Router | Traditional Next.js routing |

## Which Example Should I Use?

- **Standard React application?** Use [react](./react/) - Vite + React Router setup
- **Starting a new Next.js project?** Use [next-app](./next-app/) - the App Router is the recommended approach
- **Existing Next.js with Pages Router?** Use [next-pages](./next-pages/) - works with the traditional `pages/` directory

## Getting Started

### 1. Navigate to an example

```bash
cd examples/react  # or next-app, next-pages
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your Fathom site ID

Create a `.env` or `.env.local` file:

```bash
# For React (Vite)
VITE_FATHOM_SITE_ID=your-site-id-here

# For Next.js
NEXT_PUBLIC_FATHOM_SITE_ID=your-site-id-here
```

Get your site ID from [Fathom Analytics](https://app.usefathom.com). New to Fathom? [Sign up here](https://usefathom.com/ref/EKONBS) and get $10 credit.

### 4. Start the development server

```bash
npm run dev
```

### 5. Open your browser

Navigate to the local URL shown in the terminal.

## What's Demonstrated

Each example includes self-documenting documentation and demonstrates:

- **Automatic pageview tracking** - Navigate between pages to see tracking in action
- **Manual event tracking** - Click buttons to track custom events
- **Declarative components** - Use `<TrackClick>` for click tracking
- **TypeScript integration** - Full type safety
- **Revenue tracking** - Track events with monetary values

## Learn More

- [react-fathom Documentation](https://react-fathom.com/docs)
- [Fathom Analytics Documentation](https://usefathom.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
