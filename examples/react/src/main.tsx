import React from 'react'

import ReactDOM from 'react-dom/client'
import { FathomProvider } from 'react-fathom'
import { ReactRouterFathomTrackView } from 'react-fathom/react-router'
import { BrowserRouter } from 'react-router-dom'

import { ExampleProvider } from '@react-fathom/example-ui'

import App from './App'

const siteId = import.meta.env.VITE_FATHOM_SITE_ID

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExampleProvider>
      <BrowserRouter>
        <FathomProvider siteId={siteId} debug={{ enabled: true }}>
          <ReactRouterFathomTrackView />
          <App />
        </FathomProvider>
      </BrowserRouter>
    </ExampleProvider>
  </React.StrictMode>,
)
