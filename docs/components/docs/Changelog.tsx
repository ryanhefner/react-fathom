'use client'

import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

interface Commit {
  hash: string
  message: string
  author: string
}

interface ChangelogEntryProps {
  version: string
  date: string
  commits: Commit[]
  repoUrl?: string
}

export function ChangelogEntry({
  version,
  date,
  commits,
  repoUrl = 'https://github.com/ryanhefner/react-fathom',
}: ChangelogEntryProps) {
  return (
    <Box mb={8} pb={8} borderBottomWidth="1px">
      <Flex align="baseline" gap={4} mb={4}>
        <Heading as="h2" size="lg">
          <SiteLink
            href={`${repoUrl}/releases/tag/${version}`}
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            {version}
          </SiteLink>
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {date}
        </Text>
      </Flex>
      <VStack align="stretch" gap={2}>
        {commits.map((commit) => (
          <Flex key={commit.hash} gap={3} fontSize="sm">
            <SiteLink
              href={`${repoUrl}/commit/${commit.hash}`}
              fontFamily="mono"
              color="fg.muted"
              _hover={{ color: 'blue.500' }}
              flexShrink={0}
            >
              {commit.hash}
            </SiteLink>
            <Text flex={1}>{commit.message}</Text>
            <Text color="fg.muted" flexShrink={0}>
              {commit.author}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  )
}

interface ChangelogProps {
  entries: {
    version: string
    date: string
    commits: Commit[]
  }[]
  repoUrl?: string
}

export function Changelog({ entries, repoUrl }: ChangelogProps) {
  if (entries.length === 0) {
    return (
      <Box py={8} textAlign="center" color="fg.muted">
        <Text>No releases found.</Text>
      </Box>
    )
  }

  return (
    <Box>
      {entries.map((entry) => (
        <ChangelogEntry
          key={entry.version}
          version={entry.version}
          date={entry.date}
          commits={entry.commits}
          repoUrl={repoUrl}
        />
      ))}
    </Box>
  )
}
