'use client'

import { Container, Image, Text, VStack } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

/** Matches the sub-footer and original wordmark at https://playstack.dev/. */
export function CommuneFooter() {
  return (
    <Container
      as="section"
      aria-label="By Commune Software"
      maxW="full"
      bg="black"
      color="white"
      pt={{ base: 2, md: 8 }}
      pb={{ base: 4, md: 8 }}
      _print={{ display: 'none' }}
    >
      <VStack align="flex-start" gap={1} w="full">
        <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight={500}>
          By
        </Text>
        <SiteLink
          href="https://commune.software"
          display="block"
          w="full"
          color="white"
          _hover={{ textDecoration: 'none' }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'white',
            outlineOffset: '4px',
          }}
        >
          <Image
            src="/assets/commune-software-wordmark.svg"
            alt="Commune Software"
            w="full"
            h="auto"
            loading="lazy"
            decoding="async"
          />
        </SiteLink>
      </VStack>
    </Container>
  )
}
