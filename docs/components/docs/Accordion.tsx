'use client'

import { useState, type ReactNode } from 'react'

import { LuChevronDown } from 'react-icons/lu'

import { useFathom } from '@/lib/fathom'
import { Box, Flex, Text } from '@chakra-ui/react'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const { trackEvent } = useFathom()

  const handleToggle = () => {
    const nextOpen = !isOpen
    setIsOpen(nextOpen)
    trackEvent(`docs-accordion-${nextOpen ? 'expand' : 'collapse'}`)
  }

  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden">
      <Flex
        as="button"
        width="100%"
        px={4}
        py={3}
        align="center"
        justify="space-between"
        bg={isOpen ? 'bg.muted' : 'transparent'}
        _hover={{ bg: 'bg.muted' }}
        onClick={handleToggle}
        cursor="pointer"
        textAlign="left"
      >
        <Text fontWeight="medium">{title}</Text>
        <Box
          aria-hidden="true"
          fontSize="lg"
          color="fg.muted"
          flexShrink={0}
          transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.2s"
        >
          <LuChevronDown />
        </Box>
      </Flex>
      {isOpen && (
        <Box px={4} py={3} borderTopWidth="1px">
          {children}
        </Box>
      )}
    </Box>
  )
}

interface AccordionProps {
  children: ReactNode
}

export function Accordion({ children }: AccordionProps) {
  return (
    <Box my={4} spaceY={2}>
      {children}
    </Box>
  )
}

// Collapsible is an alias for single-item usage
interface CollapsibleProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: CollapsibleProps) {
  return (
    <Box my={4}>
      <AccordionItem title={title} defaultOpen={defaultOpen}>
        {children}
      </AccordionItem>
    </Box>
  )
}
