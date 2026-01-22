'use client'

import {
  Box,
  Flex,
  Input,
  Link,
  Modal,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

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

  // Load Pagefind on first open
  useEffect(() => {
    if (isOpen && !pagefindRef.current) {
      const loadPagefind = async () => {
        try {
          // @ts-expect-error - Pagefind is loaded from static files
          const pagefind = await import('/pagefind/pagefind.js')
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

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
          return {
            url: data.url,
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

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
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
        onClick={() => setIsOpen(true)}
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
                  variant="unstyled"
                  fontSize="lg"
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
                        onClick={handleResultClick}
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
