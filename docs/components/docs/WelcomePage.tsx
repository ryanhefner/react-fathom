'use client'

import { LuArrowRight } from 'react-icons/lu'

import { DocsCards } from '@chakra-docs/chakra'
import { Box, Heading, Stack, Text } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

const guides = [
  {
    title: 'Get started',
    description: 'Install react-fathom and track your first page view.',
    href: '/docs/getting-started',
  },
  {
    title: 'React',
    description: 'Use the provider, hooks, and declarative components.',
    href: '/docs/react',
  },
  {
    title: 'Next.js',
    description: 'Integrate App Router or Pages Router navigation tracking.',
    href: '/docs/nextjs',
  },
  {
    title: 'React Native',
    description: 'Track navigation and app-state changes on mobile.',
    href: '/docs/react-native',
  },
  {
    title: 'Router integrations',
    description: 'Connect React Router, Gatsby, or TanStack Router.',
    href: '/docs/react-router',
  },
  {
    title: 'API reference',
    description: 'Browse providers, hooks, components, and native APIs.',
    href: '/docs/api',
  },
]

export function WelcomePage() {
  return (
    <Stack gap={10}>
      <Stack align="flex-start" gap={4}>
        <Text color="fg.muted" fontSize="lg" lineHeight="tall">
          Add privacy-focused Fathom Analytics to React, Next.js, and React
          Native applications with automatic page-view tracking, typed hooks,
          and declarative components.
        </Text>
        <Box
          as="pre"
          bg="black"
          borderRadius="md"
          borderWidth="1px"
          fontFamily="mono"
          fontSize="sm"
          color="gray.100"
          maxW="full"
          overflowX="auto"
          px={4}
          py={3}
        >
          npm install react-fathom fathom-client
        </Box>
        <SiteLink
          href="/docs/getting-started"
          alignItems="center"
          color="fg"
          display="inline-flex"
          fontWeight="semibold"
          gap={1}
        >
          Read the getting-started guide
          <LuArrowRight aria-hidden="true" />
        </SiteLink>
      </Stack>

      <Box>
        <Heading as="h2" mb={4} size="xl">
          Explore the documentation
        </Heading>
        <DocsCards.Root>
          {guides.map((guide) => (
            <DocsCards.Card
              description={guide.description}
              href={guide.href}
              key={guide.href}
              title={guide.title}
            />
          ))}
        </DocsCards.Root>
      </Box>

      <Box>
        <Heading as="h2" mb={3} size="lg">
          More resources
        </Heading>
        <Text color="fg.muted">
          Review the{' '}
          <SiteLink href="https://github.com/ryanhefner/react-fathom">
            source on GitHub
          </SiteLink>{' '}
          or learn more about{' '}
          <SiteLink href="https://usefathom.com">Fathom Analytics</SiteLink>.
        </Text>
      </Box>
    </Stack>
  )
}
