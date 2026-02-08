# react-fathom React Example

A demonstration of integrating react-fathom into a standard React application using Vite and React Router.

## Live Demo

Visit [react.react-fathom.com](https://react.react-fathom.com) to see this example in action.

## Features

- **Automatic Pageview Tracking** — Track page views on React Router navigation
- **Custom Event Tracking** — Track user interactions with `useFathom` hook
- **Declarative Tracking** — Use `<TrackClick>` component for click tracking
- **Revenue Tracking** — Track events with monetary values

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ryanhefner/react-fathom.git
   cd react-fathom/examples/react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Fathom site ID:
   ```bash
   cp .env.example .env
   # Edit .env and add your site ID
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── main.tsx          # App entry with FathomProvider
├── App.tsx           # Router setup
├── components/
│   └── Layout.tsx    # Layout with pageview tracking
└── pages/
    ├── Home.tsx      # Landing page
    ├── About.tsx     # About page
    ├── Docs.tsx      # Self-documenting docs
    └── Events.tsx    # Event tracking demo
```

## Learn More

- [react-fathom Documentation](https://react-fathom.com/docs)
- [Fathom Analytics](https://usefathom.com/ref/EKONBS)
