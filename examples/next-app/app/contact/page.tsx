'use client'

import { useFathom } from 'react-fathom'
import { useState } from 'react'

export default function Contact() {
  const { trackEvent } = useFathom()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    trackEvent?.('form-submit')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Contact</h1>
        <p>Get in touch with us</p>
      </div>
      <div className="content">
        <p>
          This page demonstrates event tracking with react-fathom. When you
          submit the form below, a custom event will be tracked.
        </p>
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: '2rem',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: '0.5rem' }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                fontSize: '1rem',
              }}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '0.5rem' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                fontSize: '1rem',
              }}
            />
          </div>
          <div>
            <label
              htmlFor="message"
              style={{ display: 'block', marginBottom: '0.5rem' }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            type="submit"
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
            {submitted ? 'Submitted! (Event Tracked)' : 'Send Message'}
          </button>
        </form>
        {submitted && (
          <p style={{ marginTop: '1rem', color: '#10b981' }}>
            Form submitted! Check your Fathom Analytics dashboard to see the
            tracked event.
          </p>
        )}
      </div>
    </div>
  )
}
