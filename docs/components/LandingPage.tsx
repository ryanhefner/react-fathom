'use client'

import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Navbar } from '@/components/docs/Navbar'
import { ColorModeButton } from '@/components/docs/ColorModeButton'
import { useState } from 'react'

const frameworks = [
  {
    name: 'React',
    icon: '⚛️',
    description: 'Drop-in provider and hooks for any React app',
    href: '/docs/react',
  },
  {
    name: 'Next.js',
    icon: '▲',
    description: 'App Router and Pages Router support with SSR handling',
    href: '/docs/nextjs',
  },
  {
    name: 'React Native',
    icon: '📱',
    description: 'Navigation tracking and app state handling for mobile',
    href: '/docs/react-native',
  },
]

const features = [
  {
    icon: '🔒',
    title: 'Privacy-First',
    description: 'GDPR, CCPA, and PECR compliant. No cookies required.',
  },
  {
    icon: '⚡',
    title: 'Lightweight',
    description: 'Tiny bundle size with zero dependencies.',
  },
  {
    icon: '📘',
    title: 'TypeScript',
    description: 'Full type safety with comprehensive type definitions.',
  },
  {
    icon: '🎯',
    title: 'Simple API',
    description: 'Intuitive hooks and components that just work.',
  },
]

const installCommand = 'npm install react-fathom'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box
      as="button"
      onClick={handleCopy}
      px={2}
      py={1}
      fontSize="sm"
      color="fg.muted"
      _hover={{ color: 'fg' }}
    >
      {copied ? '✓' : '📋'}
    </Box>
  )
}

function LandingNavbar() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      bg="bg"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <Link asChild fontWeight="bold" fontSize="lg" _hover={{ textDecoration: 'none' }}>
            <NextLink href="/">react-fathom</NextLink>
          </Link>
          <HStack gap={6}>
            <Link asChild color="fg.muted" _hover={{ color: 'fg' }} display={{ base: 'none', md: 'block' }}>
              <NextLink href="/docs">Documentation</NextLink>
            </Link>
            <Link asChild color="fg.muted" _hover={{ color: 'fg' }} display={{ base: 'none', md: 'block' }}>
              <NextLink href="/docs/api">API</NextLink>
            </Link>
            <Link
              href="https://github.com/ryanhefner/react-fathom"
              color="fg.muted"
              _hover={{ color: 'fg' }}
            >
              GitHub
            </Link>
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export function LandingPage() {
  return (
    <Box minH="100vh">
      <LandingNavbar />

      {/* Hero Section */}
      <Container maxW="container.lg" py={{ base: 16, md: 24 }} textAlign="center">
        <VStack gap={6}>
          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="bold"
            lineHeight="tight"
          >
            Privacy-focused analytics
            <br />
            <Text as="span" color="blue.500">
              for React
            </Text>
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="fg.muted" maxW="2xl">
            A lightweight React integration for Fathom Analytics.
            Track page views and custom events while respecting user privacy.
          </Text>

          {/* Install command */}
          <Flex
            mt={4}
            px={4}
            py={3}
            bg="gray.900"
            _light={{ bg: 'gray.100' }}
            borderRadius="lg"
            align="center"
            gap={2}
            fontFamily="mono"
            fontSize="sm"
          >
            <Text color="fg.muted">$</Text>
            <Text>{installCommand}</Text>
            <CopyButton text={installCommand} />
          </Flex>

          {/* CTA buttons */}
          <HStack gap={4} mt={4}>
            <Link
              asChild
              px={6}
              py={3}
              bg="blue.500"
              color="white"
              borderRadius="lg"
              fontWeight="medium"
              _hover={{ bg: 'blue.600', textDecoration: 'none' }}
            >
              <NextLink href="/docs/getting-started">Get Started</NextLink>
            </Link>
            <Link
              href="https://github.com/ryanhefner/react-fathom"
              px={6}
              py={3}
              borderWidth="1px"
              borderRadius="lg"
              fontWeight="medium"
              _hover={{ bg: 'bg.muted', textDecoration: 'none' }}
            >
              View on GitHub
            </Link>
          </HStack>
        </VStack>
      </Container>

      {/* Frameworks Section */}
      <Box bg="bg.muted" py={{ base: 16, md: 20 }}>
        <Container maxW="container.lg">
          <VStack gap={12}>
            <VStack gap={3} textAlign="center">
              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }}>
                Works with your stack
              </Heading>
              <Text color="fg.muted" fontSize="lg">
                First-class support for popular React frameworks
              </Text>
            </VStack>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={6}
              width="100%"
            >
              {frameworks.map((framework) => (
                <Link
                  key={framework.name}
                  asChild
                  _hover={{ textDecoration: 'none' }}
                >
                  <NextLink href={framework.href}>
                    <Box
                      p={6}
                      bg="bg"
                      borderRadius="xl"
                      borderWidth="1px"
                      _hover={{
                        borderColor: 'blue.500',
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.2s"
                      height="100%"
                    >
                      <Text fontSize="3xl" mb={3}>
                        {framework.icon}
                      </Text>
                      <Heading as="h3" size="md" mb={2}>
                        {framework.name}
                      </Heading>
                      <Text color="fg.muted" fontSize="sm">
                        {framework.description}
                      </Text>
                    </Box>
                  </NextLink>
                </Link>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.lg" py={{ base: 16, md: 20 }}>
        <VStack gap={12}>
          <VStack gap={3} textAlign="center">
            <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }}>
              Why react-fathom?
            </Heading>
            <Text color="fg.muted" fontSize="lg">
              Simple, privacy-focused analytics integration
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
            gap={8}
            width="100%"
          >
            {features.map((feature) => (
              <Flex key={feature.title} gap={4}>
                <Text fontSize="2xl">{feature.icon}</Text>
                <Box>
                  <Heading as="h3" size="sm" mb={1}>
                    {feature.title}
                  </Heading>
                  <Text color="fg.muted" fontSize="sm">
                    {feature.description}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Grid>
        </VStack>
      </Container>

      {/* Code Example Section */}
      <Box bg="bg.muted" py={{ base: 16, md: 20 }}>
        <Container maxW="container.lg">
          <VStack gap={8}>
            <VStack gap={3} textAlign="center">
              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }}>
                Get started in minutes
              </Heading>
              <Text color="fg.muted" fontSize="lg">
                Just wrap your app and start tracking
              </Text>
            </VStack>

            <Box
              w="100%"
              maxW="2xl"
              bg="gray.900"
              _light={{ bg: 'gray.800' }}
              borderRadius="xl"
              overflow="hidden"
            >
              <Flex
                px={4}
                py={2}
                bg="gray.800"
                _light={{ bg: 'gray.700' }}
                gap={2}
              >
                <Box w={3} h={3} borderRadius="full" bg="red.500" />
                <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
                <Box w={3} h={3} borderRadius="full" bg="green.500" />
              </Flex>
              <Box p={6} fontFamily="mono" fontSize="sm" color="gray.100">
                <Text color="purple.400">import</Text>
                <Text as="span" color="gray.100"> {'{ '}</Text>
                <Text as="span" color="yellow.300">FathomProvider</Text>
                <Text as="span" color="gray.100">{' }'} </Text>
                <Text as="span" color="purple.400">from</Text>
                <Text as="span" color="green.300"> 'react-fathom'</Text>
                <Text color="gray.100">;</Text>
                <Text mt={4} color="purple.400">export default function</Text>
                <Text as="span" color="blue.300"> App</Text>
                <Text as="span" color="gray.100">() {'{'}</Text>
                <Text ml={4} color="purple.400">return</Text>
                <Text as="span" color="gray.100"> (</Text>
                <Text ml={8} color="gray.100">{'<'}</Text>
                <Text as="span" color="blue.300">FathomProvider</Text>
                <Text as="span" color="cyan.300"> siteId</Text>
                <Text as="span" color="gray.100">=</Text>
                <Text as="span" color="green.300">"ABCDEFGH"</Text>
                <Text as="span" color="gray.100">{'>'}</Text>
                <Text ml={12} color="gray.100">{'<'}</Text>
                <Text as="span" color="blue.300">YourApp</Text>
                <Text as="span" color="gray.100"> /{'>'}</Text>
                <Text ml={8} color="gray.100">{'</'}</Text>
                <Text as="span" color="blue.300">FathomProvider</Text>
                <Text as="span" color="gray.100">{'>'}</Text>
                <Text ml={4} color="gray.100">);</Text>
                <Text color="gray.100">{'}'}</Text>
              </Box>
            </Box>

            <Link
              asChild
              color="blue.500"
              fontWeight="medium"
              _hover={{ textDecoration: 'underline' }}
            >
              <NextLink href="/docs/getting-started">
                Read the full documentation →
              </NextLink>
            </Link>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box borderTopWidth="1px" py={8}>
        <Container maxW="container.lg">
          <Flex
            justify="space-between"
            align="center"
            flexDir={{ base: 'column', md: 'row' }}
            gap={4}
          >
            <Text fontSize="sm" color="fg.muted">
              MIT {new Date().getFullYear()} © Ryan Hefner
            </Text>
            <HStack gap={6} fontSize="sm">
              <Link asChild color="fg.muted" _hover={{ color: 'fg' }}>
                <NextLink href="/docs">Documentation</NextLink>
              </Link>
              <Link
                href="https://github.com/ryanhefner/react-fathom"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                GitHub
              </Link>
              <Link
                href="https://usefathom.com"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                Fathom Analytics
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
