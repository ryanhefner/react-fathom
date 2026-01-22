import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { FathomProvider } from 'react-fathom'
import App from './App'

const siteId = import.meta.env.VITE_FATHOM_SITE_ID

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        {siteId ? (
          <FathomProvider siteId={siteId}>
            <App />
          </FathomProvider>
        ) : (
          <App />
        )}
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)
