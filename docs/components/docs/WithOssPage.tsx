'use client'

import { Fragment } from 'react'

import { ossProjects } from '@/lib/oss-projects'
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  useSlotRecipe,
} from '@chakra-ui/react'

import { OssMark } from './OssMark'
import { SiteLink } from './SiteLink'

export function WithOssPage() {
  const styles = useSlotRecipe({ key: 'siteWithOss' })()
  return (
    <Container as="main" css={styles.root}>
      <Flex css={styles.hero}>
        <Heading
          as="h1"
          aria-label="Made with open-source software"
          css={styles.title}
        >
          <Text as="span" aria-hidden="true">
            w/
          </Text>
          <OssMark size="hero" decorative />
        </Heading>
        <Text css={styles.intro}>
          This library and documentation site are built with open-source
          software. In appreciation of the community behind them, here are the
          key projects that make the site possible.
        </Text>
      </Flex>
      <Box as="section" aria-labelledby="oss-projects" css={styles.projects}>
        <Heading as="h2" id="oss-projects" css={styles.sectionTitle}>
          Open-source software
        </Heading>
        <Stack as="ul" css={styles.list}>
          {ossProjects.map((project) => (
            <Grid as="li" key={project.name} css={styles.row}>
              <Text css={styles.name}>{project.name}</Text>
              <Text css={styles.description}>{project.description}</Text>
              <Box css={styles.urls}>
                {project.urls.map((url, index) => (
                  <Fragment key={url}>
                    {index > 0 && (
                      <Text as="span" aria-hidden="true">
                        {' '}
                        /{' '}
                      </Text>
                    )}
                    <SiteLink href={url} css={styles.projectLink}>
                      {url
                        .replace(/^https:\/\/(?:www\.)?/, '')
                        .replace(/\/$/, '')}
                    </SiteLink>
                  </Fragment>
                ))}
              </Box>
            </Grid>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}
