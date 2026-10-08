import React from 'react'

import ReactDOM from 'react-dom/client'

import { ExampleProvider } from '@react-fathom/example-ui'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExampleProvider>
      <RouterProvider router={router} />
    </ExampleProvider>
  </React.StrictMode>,
)
