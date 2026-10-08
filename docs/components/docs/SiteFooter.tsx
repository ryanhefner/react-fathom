'use client'

import { Box, Container, Flex, Text, useSlotRecipe } from '@chakra-ui/react'

import { OssMark } from './OssMark'
import { SiteLink } from './SiteLink'

interface SiteFooterProps {
  year: number
}

export function SiteFooter({ year }: SiteFooterProps) {
  const styles = useSlotRecipe({ key: 'siteFooter' })()
  return (
    <Box as="footer" aria-label="Site credits and license" css={styles.root}>
      <Container css={styles.container}>
        <Flex css={styles.content}>
          <Text>
            © {year > 2025 ? `2025–${year}` : year} —{' '}
            <SiteLink href="https://www.ryanhefner.com" css={styles.creditLink}>
              Ryan Hefner
            </SiteLink>
          </Text>
          <Flex css={styles.links}>
            <SiteLink
              href="https://github.com/ryanhefner/react-fathom/blob/main/LICENSE"
              css={styles.licenseLink}
            >
              MIT license
            </SiteLink>
            <SiteLink
              href="/withoss"
              aria-label="Made with open-source software"
              css={styles.ossLink}
            >
              <OssMark decorative />
            </SiteLink>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
