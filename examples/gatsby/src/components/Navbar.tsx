import React from 'react'
import { Link } from 'gatsby'
import { Box, Flex, Text, HStack } from '@chakra-ui/react'

export function Navbar() {
  return (
    <Box
      as="nav"
      bg="gray.100"
      _dark={{ bg: 'gray.800' }}
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      _darkBorderColor={{ borderBottomColor: 'gray.700' }}
    >
      <Flex
        maxW="800px"
        mx="auto"
        px={4}
        py={3}
        justify="space-between"
        align="center"
      >
        <Text fontWeight="bold" fontSize="lg">
          react-fathom
        </Text>
        <HStack gap={4}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </HStack>
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
          Gatsby
        </Text>
      </Flex>
    </Box>
  )
}
