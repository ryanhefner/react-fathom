export default function Docs() {
  return (
    <div>
      <div className="page-header">
        <h1>Documentation</h1>
        <p>How to integrate react-fathom into your Next.js Pages Router application</p>
      </div>
      <div className="content">
        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Installation</h2>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#e5e5e5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
            }}
          >
            <code>npm install react-fathom</code>
          </pre>
        </section>

        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Setup</h2>
          <p>
            Wrap your app with <code>FathomProvider</code> and add{' '}
            <code>NextFathomTrackViewPages</code> in your _app.tsx:
          </p>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#e5e5e5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            <code>{`// pages/_app.tsx
import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewPages } from 'react-fathom/next'

export default function App({ Component, pageProps }) {
  return (
    <FathomProvider siteId="YOUR_SITE_ID">
      <NextFathomTrackViewPages />
      <Component {...pageProps} />
    </FathomProvider>
  )
}`}</code>
          </pre>
        </section>

        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Event Tracking</h2>
          <p>
            Use the <code>useFathom</code> hook to track custom events:
          </p>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#e5e5e5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            <code>{`import { useFathom } from 'react-fathom'

export default function MyComponent() {
  const { trackEvent, trackGoal } = useFathom()

  return (
    <>
      <button onClick={() => trackEvent('button-click')}>
        Track Event
      </button>
      <button onClick={() => trackGoal('purchase', 2999)}>
        Track Goal with Value
      </button>
    </>
  )
}`}</code>
          </pre>
        </section>

        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Automatic Pageview Tracking</h2>
          <p>
            The <code>NextFathomTrackViewPages</code> component automatically tracks
            pageviews when the route changes. It listens to Next.js Router events to
            detect navigation.
          </p>
          <p>No additional configuration is needed for pageview tracking.</p>
        </section>

        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
            Differences from App Router
          </h2>
          <p>The Pages Router setup differs from App Router in a few ways:</p>
          <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
            <li>
              <strong>Provider:</strong> Use <code>FathomProvider</code> instead of{' '}
              <code>NextFathomProviderApp</code>
            </li>
            <li>
              <strong>Pageview tracking:</strong> Use <code>NextFathomTrackViewPages</code>{' '}
              instead of the built-in tracking in <code>NextFathomProviderApp</code>
            </li>
            <li>
              <strong>Location:</strong> Setup in <code>pages/_app.tsx</code> instead of{' '}
              <code>app/layout.tsx</code>
            </li>
          </ul>
        </section>

        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Environment Variables</h2>
          <p>Store your site ID in an environment variable:</p>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#e5e5e5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            <code>{`# .env.local
NEXT_PUBLIC_FATHOM_SITE_ID=YOUR_SITE_ID`}</code>
          </pre>
          <p style={{ marginTop: '1rem' }}>Then use it in your _app.tsx:</p>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#e5e5e5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            <code>{`const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID`}</code>
          </pre>
        </section>

        <section>
          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Learn More</h2>
          <ul>
            <li>
              <a
                href="https://react-fathom.com/docs/nextjs"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0070f3' }}
              >
                Full Documentation
              </a>
            </li>
            <li>
              <a
                href="https://react-fathom.com/docs/api"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0070f3' }}
              >
                API Reference
              </a>
            </li>
            <li>
              <a
                href="https://github.com/ryanhefner/react-fathom"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0070f3' }}
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <a
                href="https://usefathom.com/ref/EKONBS"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0070f3' }}
              >
                Fathom Analytics (Get $10 credit)
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
