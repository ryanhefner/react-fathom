import { Box, Heading, Text, VStack, Code, Link } from '@chakra-ui/react'

export function Docs() {
  return (
    <VStack gap={8} align="stretch">
      <Box>
        <Heading as="h1" size="xl" mb={4}>
          Documentation
        </Heading>
        <Text color="fg.muted">
          How to integrate react-fathom into your React application.
        </Text>
      </Box>

      {/* Installation */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Installation
        </Heading>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100">
          <Text color="fg.muted">$ npm install react-fathom fathom-client</Text>
        </Box>
      </Box>

      {/* Setup */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Setup
        </Heading>
        <Text mb={4}>
          Wrap your application with <Code>FathomProvider</Code>:
        </Text>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100" whiteSpace="pre">
{`import { FathomProvider } from 'react-fathom'

function App() {
  return (
    <FathomProvider siteId="YOUR_SITE_ID">
      <YourApp />
    </FathomProvider>
  )
}`}
        </Box>
      </Box>

      {/* Pageview Tracking */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Pageview Tracking
        </Heading>
        <Text mb={4}>
          For React Router, track pageviews on route changes using the <Code>useFathom</Code> hook:
        </Text>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100" whiteSpace="pre">
{`import { useLocation } from 'react-router-dom'
import { useFathom } from 'react-fathom'
import { useEffect } from 'react'

function Layout() {
  const location = useLocation()
  const { trackPageview } = useFathom()

  useEffect(() => {
    trackPageview()
  }, [location.pathname, trackPageview])

  return <Outlet />
}`}
        </Box>
      </Box>

      {/* Event Tracking */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Event Tracking
        </Heading>
        <Text mb={4}>
          Track custom events using the <Code>useFathom</Code> hook:
        </Text>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100" whiteSpace="pre">
{`import { useFathom } from 'react-fathom'

function SignupButton() {
  const { trackEvent } = useFathom()

  return (
    <button onClick={() => trackEvent('signup-click')}>
      Sign Up
    </button>
  )
}`}
        </Box>
      </Box>

      {/* Declarative Tracking */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Declarative Tracking
        </Heading>
        <Text mb={4}>
          Use <Code>{'<TrackClick>'}</Code> for declarative event tracking:
        </Text>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100" whiteSpace="pre">
{`import { TrackClick } from 'react-fathom'

function CTAButton() {
  return (
    <TrackClick eventName="cta-click">
      <button>Get Started</button>
    </TrackClick>
  )
}`}
        </Box>
      </Box>

      {/* Environment Variables */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Environment Variables
        </Heading>
        <Text mb={4}>
          Store your site ID in an environment variable:
        </Text>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100">
          <Text color="fg.muted"># .env</Text>
          <Text>VITE_FATHOM_SITE_ID=YOUR_SITE_ID</Text>
        </Box>
        <Box mt={4} bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100" whiteSpace="pre">
{`<FathomProvider siteId={import.meta.env.VITE_FATHOM_SITE_ID}>
  <App />
</FathomProvider>`}
        </Box>
      </Box>

      {/* More Info */}
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Learn More
        </Heading>
        <VStack align="stretch" gap={2}>
          <Link href="https://react-fathom.com/docs" color="blue.500">
            Full Documentation →
          </Link>
          <Link href="https://react-fathom.com/docs/api" color="blue.500">
            API Reference →
          </Link>
          <Link href="https://github.com/ryanhefner/react-fathom" color="blue.500">
            GitHub Repository →
          </Link>
        </VStack>
      </Box>
    </VStack>
  )
}
