'use client'

import { Box, Container, Flex, Text } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

interface SiteFooterProps {
  year: number
}

export function SiteFooter({ year }: SiteFooterProps) {
  return (
    <Box
      as="footer"
      aria-label="Site credits and license"
      bg="bg"
      color="fg.muted"
      borderTopWidth="1px"
      borderColor="border"
    >
      <Container maxW="7xl" py={{ base: 6, md: 8 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          gap={3}
          fontSize="sm"
        >
          <Text>
            © {year > 2025 ? `2025–${year}` : year}{' '}
            <SiteLink href="https://ryanhefner.com" color="fg">
              Ryan Hefner
            </SiteLink>
            ,{' '}
            <SiteLink href="https://www.commune.software" color="fg">
              Commune Software
            </SiteLink>
            .
          </Text>
          <SiteLink
            href="https://github.com/ryanhefner/react-fathom/blob/main/LICENSE"
            color="fg"
            minH="44px"
            flexShrink={0}
          >
            MIT license
          </SiteLink>
        </Flex>
      </Container>
    </Box>
  )
}
