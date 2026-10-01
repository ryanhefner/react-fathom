'use client'

import { Container, Image, Text, VStack } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

/** Matches the sub-footer and original wordmark at https://playstack.dev/. */
export function CommuneFooter() {
  return (
    <Container
      as="footer"
      aria-label="By Commune Software"
      maxW="full"
      bg="bg"
      color="fg"
      pb={{ base: 4, md: 8 }}
    >
      <VStack align="flex-start" gap={1} mt={{ base: 2, md: 8 }} w="full">
        <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight={500}>
          By
        </Text>
        <SiteLink
          href="https://www.commune.software"
          display="block"
          w="full"
          color="fg"
          _hover={{ textDecoration: 'none' }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'fg',
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
            filter="invert(1)"
            _dark={{ filter: 'none' }}
          />
        </SiteLink>
      </VStack>
    </Container>
  )
}
