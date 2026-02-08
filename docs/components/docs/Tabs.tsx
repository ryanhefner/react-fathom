'use client'

import { Box, Flex } from '@chakra-ui/react'
import { useState, createContext, useContext, type ReactNode } from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

interface TabsProps {
  defaultValue?: string
  children: ReactNode
}

export function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || '')

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <Box my={4}>{children}</Box>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  children: ReactNode
}

export function TabList({ children }: TabListProps) {
  return (
    <Flex borderBottomWidth="1px" gap={0}>
      {children}
    </Flex>
  )
}

interface TabTriggerProps {
  value: string
  children: ReactNode
}

export function TabTrigger({ value, children }: TabTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabTrigger must be used within Tabs')

  const isActive = context.activeTab === value

  return (
    <Box
      as="button"
      px={4}
      py={2}
      fontSize="sm"
      fontWeight={isActive ? 'semibold' : 'normal'}
      color={isActive ? 'fg' : 'fg.muted'}
      borderBottomWidth="2px"
      borderBottomColor={isActive ? 'blue.500' : 'transparent'}
      mb="-1px"
      _hover={{ color: 'fg' }}
      onClick={() => context.setActiveTab(value)}
    >
      {children}
    </Box>
  )
}

interface TabContentProps {
  value: string
  children: ReactNode
}

export function TabContent({ value, children }: TabContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabContent must be used within Tabs')

  if (context.activeTab !== value) return null

  return <Box pt={4}>{children}</Box>
}

// Simple Tab component for MDX
interface TabProps {
  label: string
  children: ReactNode
}

export function Tab({ label, children }: TabProps) {
  return (
    <Box>
      <Box
        px={4}
        py={2}
        fontSize="sm"
        fontWeight="semibold"
        borderBottomWidth="2px"
        borderBottomColor="blue.500"
      >
        {label}
      </Box>
      <Box pt={4}>{children}</Box>
    </Box>
  )
}
