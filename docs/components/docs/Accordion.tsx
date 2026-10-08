'use client'

import type { ReactNode } from 'react'

import { LuChevronDown } from 'react-icons/lu'

import { useFathom } from '@/lib/fathom'
import {
  Box,
  Collapsible as ChakraCollapsible,
  Text,
  useSlotRecipe,
} from '@chakra-ui/react'

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
  const styles = useSlotRecipe({ key: 'siteDisclosure' })()
  const { trackEvent } = useFathom()

  return (
    <ChakraCollapsible.Root
      css={styles.root}
      defaultOpen={defaultOpen}
      lazyMount
      unmountOnExit
      onOpenChange={({ open }) =>
        trackEvent(`docs-accordion-${open ? 'expand' : 'collapse'}`)
      }
    >
      <ChakraCollapsible.Trigger css={styles.trigger}>
        <Text as="span" fontWeight="medium">
          {title}
        </Text>
        <ChakraCollapsible.Indicator aria-hidden="true" css={styles.indicator}>
          <LuChevronDown />
        </ChakraCollapsible.Indicator>
      </ChakraCollapsible.Trigger>
      <ChakraCollapsible.Content css={styles.content}>
        {children}
      </ChakraCollapsible.Content>
    </ChakraCollapsible.Root>
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
