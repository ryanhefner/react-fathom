import React from 'react'
import { Link } from 'gatsby'
import { Box, Flex, Text, HStack, Link as ChakraLink } from '@chakra-ui/react'

export function Navbar() {
  return (
    <Box as="header" pt={{ base: 6, md: 8 }} pb={{ base: 4, md: 6 }}>
      <Flex
        maxW="640px"
        mx="auto"
        px={{ base: 5, md: 6 }}
        justify="space-between"
        align="center"
      >
        <HStack gap={{ base: 3, md: 4 }}>
          <ChakraLink
            asChild
            fontWeight="medium"
            fontSize="sm"
            _hover={{ textDecoration: 'none', opacity: 0.7 }}
          >
            <Link to="/">react-fathom</Link>
          </ChakraLink>
          <Text fontSize="sm" color="fg.muted">
            — Gatsby
          </Text>
        </HStack>
        <HStack gap={{ base: 4, md: 5 }}>
          <ChakraLink
            asChild
            color="fg.muted"
            _hover={{ color: 'fg' }}
            fontSize="sm"
            display={{ base: 'none', md: 'block' }}
          >
            <Link to="/">Home</Link>
          </ChakraLink>
          <ChakraLink
            asChild
            color="fg.muted"
            _hover={{ color: 'fg' }}
            fontSize="sm"
          >
            <Link to="/about">About</Link>
          </ChakraLink>
          <ChakraLink
            asChild
            color="fg.muted"
            _hover={{ color: 'fg' }}
            fontSize="sm"
          >
            <Link to="/contact">Contact</Link>
          </ChakraLink>
        </HStack>
      </Flex>
    </Box>
  )
}
