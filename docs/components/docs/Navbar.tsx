'use client'

import { SiGithub } from 'react-icons/si'

import type { DocsSearchRecord } from '@chakra-docs/core'
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Portal,
  Tooltip,
  useSlotRecipe,
} from '@chakra-ui/react'

import { DocsSiteSearch } from './DocsSiteSearch'
import { SiteLink } from './SiteLink'

interface NavbarProps {
  searchRecords: readonly DocsSearchRecord[]
}

export function Navbar({ searchRecords }: NavbarProps) {
  const styles = useSlotRecipe({ key: 'siteNavbar' })()
  return (
    <Box as="header" css={styles.root}>
      <Container css={styles.container}>
        <Flex justify="space-between" align="center" h="full">
          <SiteLink href="/" css={styles.brand}>
            react-fathom
          </SiteLink>
          <HStack gap={6}>
            <HStack as="nav" gap={6} display={{ base: 'none', md: 'flex' }}>
              <SiteLink href="/docs/getting-started" css={styles.navLink}>
                Docs
              </SiteLink>
              <SiteLink href="/docs/api" css={styles.navLink}>
                API
              </SiteLink>
            </HStack>
            <HStack gap={2}>
              <DocsSiteSearch records={searchRecords} />
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    asChild
                    aria-label="View react-fathom on GitHub"
                    variant="ghost"
                    css={styles.githubTrigger}
                  >
                    <SiteLink href="https://github.com/ryanhefner/react-fathom">
                      <SiGithub aria-hidden="true" />
                    </SiteLink>
                  </IconButton>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content>GitHub</Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
