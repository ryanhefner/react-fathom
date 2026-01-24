import { useFathom } from 'react-fathom'

export default function Home() {
  const { trackEvent, trackGoal } = useFathom()

  return (
    <div>
      <div className="page-header">
        <h1>
          Next.js Pages Router
          <span>Example</span>
        </h1>
        <p>
          This example demonstrates how to integrate react-fathom into a Next.js
          application using the Pages Router.
        </p>
      </div>

      <div className="section">
        <h2>Try It Out</h2>
        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={() => trackEvent('button_click')}
          >
            Track Event
          </button>
          <button
            className="btn btn-accent"
            onClick={() => trackGoal('EXAMPLE01', 100)}
          >
            Track Goal ($1.00)
          </button>
        </div>
      </div>

      <div className="section">
        <h2>Features</h2>
        <ul className="content">
          <li>Automatic pageview tracking on route changes</li>
          <li>Custom event tracking</li>
          <li>Goal conversion tracking</li>
          <li>Debug mode with event visualization</li>
          <li>Privacy-focused (no cookies)</li>
        </ul>
      </div>
    </div>
  )
}
