'use client'

import {
  Box,
  Flex,
  Input,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFathom } from 'react-fathom'

interface SearchResult {
  url: string
  title: string
  excerpt: string
}

interface PagefindResult {
  url: string
  meta: { title?: string }
  excerpt: string
}

interface PagefindUI {
  search: (query: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pagefindRef = useRef<PagefindUI | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { trackEvent } = useFathom()

  // Load Pagefind on first open
  useEffect(() => {
    if (isOpen && !pagefindRef.current) {
      const loadPagefind = async () => {
        try {
          // Use dynamic import with webpackIgnore to prevent build-time resolution
          const pagefindPath = '/pagefind/pagefind.js'
          const pagefind = await import(/* webpackIgnore: true */ pagefindPath)
          await pagefind.init()
          pagefindRef.current = pagefind
        } catch (e) {
          console.warn('Pagefind not available (run `npm run build` first)')
        }
      }
      loadPagefind()
    }
  }, [isOpen])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Keyboard shortcut (Cmd/Ctrl + K) and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        trackEvent('search-open')
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    const handleOpenSearch = () => {
      trackEvent?.('search-open')
      setIsOpen(true)
    }

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-search', handleOpenSearch)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-search', handleOpenSearch)
    }
  }, [trackEvent])

  // Search handler
  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery)

    if (!searchQuery.trim() || !pagefindRef.current) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const search = await pagefindRef.current.search(searchQuery)
      const searchResults = await Promise.all(
        search.results.slice(0, 8).map(async (result) => {
          const data = await result.data()
          // Strip .html extension from URLs since Next.js routes don't have them
          const url = data.url.replace(/\.html$/, '')
          return {
            url,
            title: data.meta?.title || 'Untitled',
            excerpt: data.excerpt,
          }
        })
      )
      setResults(searchResults)
    } catch (e) {
      console.error('Search error:', e)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleResultClick = (result: SearchResult) => {
    trackEvent('search-result-click')
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  const handleOpen = () => {
    trackEvent?.('search-open')
    setIsOpen(true)
  }

  return (
    <>
      {/* Search trigger button */}
      <Flex
        as="button"
        align="center"
        gap={2}
        px={3}
        py={1.5}
        borderWidth="1px"
        borderRadius="md"
        color="fg.muted"
        fontSize="sm"
        _hover={{ borderColor: 'fg.muted' }}
        onClick={handleOpen}
      >
        <Text>🔍</Text>
        <Text display={{ base: 'none', md: 'block' }}>Search...</Text>
        <Text
          display={{ base: 'none', md: 'block' }}
          fontSize="xs"
          color="fg.subtle"
          bg="bg.muted"
          px={1.5}
          py={0.5}
          borderRadius="sm"
        >
          ⌘K
        </Text>
      </Flex>

      {/* Search modal */}
      {isOpen && (
        <Box
          position="fixed"
          inset={0}
          zIndex={100}
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <Box
            position="absolute"
            inset={0}
            bg="blackAlpha.600"
            backdropFilter="blur(4px)"
          />

          {/* Modal content */}
          <Flex
            position="relative"
            justify="center"
            pt={{ base: 4, md: 20 }}
            px={4}
          >
            <Box
              bg="bg"
              borderRadius="xl"
              shadow="2xl"
              width="100%"
              maxW="600px"
              overflow="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <Flex align="center" px={4} py={3} borderBottomWidth="1px">
                <Text mr={3}>🔍</Text>
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search documentation..."
                  variant="flushed"
                  border="none"
                  fontSize="lg"
                  _focus={{ boxShadow: 'none' }}
                />
                <Text
                  fontSize="xs"
                  color="fg.muted"
                  bg="bg.muted"
                  px={2}
                  py={1}
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setIsOpen(false)}
                >
                  ESC
                </Text>
              </Flex>

              {/* Results */}
              <Box maxH="400px" overflowY="auto">
                {isLoading ? (
                  <Box p={4} textAlign="center" color="fg.muted">
                    Searching...
                  </Box>
                ) : results.length > 0 ? (
                  <VStack align="stretch" gap={0} py={2}>
                    {results.map((result, i) => (
                      <Link
                        key={i}
                        asChild
                        _hover={{ textDecoration: 'none' }}
                        onClick={() => handleResultClick(result)}
                      >
                        <NextLink href={result.url}>
                          <Box
                            px={4}
                            py={3}
                            _hover={{ bg: 'bg.muted' }}
                          >
                            <Text fontWeight="medium" mb={1}>
                              {result.title}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="fg.muted"
                              lineClamp={2}
                              dangerouslySetInnerHTML={{ __html: result.excerpt }}
                              css={{
                                '& mark': {
                                  background: 'yellow.200',
                                  color: 'black',
                                  borderRadius: '2px',
                                  padding: '0 2px',
                                },
                              }}
                            />
                          </Box>
                        </NextLink>
                      </Link>
                    ))}
                  </VStack>
                ) : query ? (
                  <Box p={4} textAlign="center" color="fg.muted">
                    No results found for "{query}"
                  </Box>
                ) : (
                  <Box p={4} textAlign="center" color="fg.muted">
                    Start typing to search...
                  </Box>
                )}
              </Box>

              {/* Footer */}
              <Flex
                px={4}
                py={2}
                borderTopWidth="1px"
                justify="space-between"
                fontSize="xs"
                color="fg.muted"
              >
                <Text>↑↓ to navigate</Text>
                <Text>↵ to select</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  )
}
