import { useFathom } from 'react-fathom'

export default function Home() {
  const { trackEvent, trackGoal } = useFathom()

  const handleButtonClick = () => {
    trackEvent?.('button-click')
    alert('Button click tracked! Check your Fathom Analytics dashboard.')
  }

  const handleGoalClick = () => {
    trackGoal?.('demo-signup', 0)
    alert('Goal tracked! Check your Fathom Analytics dashboard.')
  }

  return (
    <div>
      <div className="page-header">
        <h1>Welcome to react-fathom</h1>
        <p>Next.js Pages Router Example</p>
      </div>
      <div className="content">
        <p>
          This is an example Next.js application using the Pages Router with{' '}
          <strong>react-fathom</strong> for analytics tracking.
        </p>
        <p>
          Navigate between pages to see automatic pageview tracking in action.
          You can also use the buttons below to test event and goal tracking.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleButtonClick}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Track Event
          </button>
          <button
            onClick={handleGoalClick}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Track Goal
          </button>
        </div>
        <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          Features Demonstrated
        </h2>
        <ul>
          <li>
            <strong>Automatic pageview tracking</strong> - Pageviews are tracked
            automatically when you navigate between pages
          </li>
          <li>
            <strong>Event tracking</strong> - Use the &quot;Track Event&quot;
            button to manually track custom events
          </li>
          <li>
            <strong>Goal tracking</strong> - Use the &quot;Track Goal&quot;
            button to track goal conversions
          </li>
          <li>
            <strong>TypeScript support</strong> - Full type safety for all
            tracking methods
          </li>
        </ul>
      </div>
    </div>
  )
}
