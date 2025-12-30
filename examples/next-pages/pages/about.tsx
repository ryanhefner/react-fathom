export default function About() {
  return (
    <div>
      <div className="page-header">
        <h1>About</h1>
        <p>Learn more about this example</p>
      </div>
      <div className="content">
        <p>
          This page demonstrates automatic pageview tracking with react-fathom.
          When you navigated to this page, a pageview was automatically tracked
          in your Fathom Analytics dashboard.
        </p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          How It Works
        </h2>
        <p>
          The <code>NextFathomTrackViewPages</code> component in{' '}
          <code>pages/_app.tsx</code> automatically tracks pageviews whenever the
          route changes. This is done using Next.js Pages Router&apos;s{' '}
          <code>useRouter</code> hook and listening to route change events.
        </p>
        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          Integration Steps
        </h2>
        <ol style={{ marginLeft: '2rem' }}>
          <li>Install react-fathom and fathom-client</li>
          <li>Wrap your app with FathomProvider in pages/_app.tsx</li>
          <li>Add NextFathomTrackViewPages component</li>
          <li>That&apos;s it! Pageviews are tracked automatically</li>
        </ol>
      </div>
    </div>
  )
}
