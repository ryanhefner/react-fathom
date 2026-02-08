'use client'

import { Box, Link, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import type { TOCItem } from '@/lib/docs'

interface TableOfContentsProps {
  toc: TOCItem[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    const headings = document.querySelectorAll('h2, h3')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (toc.length === 0) {
    return null
  }

  return (
    <Box
      as="nav"
      position="sticky"
      top="73px"
      height="calc(100vh - 73px)"
      overflowY="auto"
      py={8}
      pl={4}
      display={{ base: 'none', xl: 'block' }}
      width="200px"
      flexShrink={0}
    >
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider" color="fg.muted" mb={3}>
        On this page
      </Text>
      <VStack align="stretch" gap={1}>
        {toc.map((item) => (
          <TOCLink key={item.id} item={item} activeId={activeId} />
        ))}
      </VStack>
    </Box>
  )
}

interface TOCLinkProps {
  item: TOCItem
  activeId: string
}

function TOCLink({ item, activeId }: TOCLinkProps) {
  const isActive = activeId === item.id

  return (
    <>
      <Link
        href={`#${item.id}`}
        display="block"
        py={1}
        pl={item.level === 3 ? 4 : 0}
        fontSize="sm"
        color={isActive ? 'fg' : 'fg.muted'}
        fontWeight={isActive ? 'medium' : 'normal'}
        _hover={{ color: 'fg' }}
        lineClamp={1}
      >
        {item.title}
      </Link>
      {item.children?.map((child) => (
        <TOCLink key={child.id} item={child} activeId={activeId} />
      ))}
    </>
  )
}
