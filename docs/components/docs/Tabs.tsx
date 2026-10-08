'use client'

import { Children, isValidElement, type ReactNode } from 'react'

import { useFathom } from '@/lib/fathom'
import { DocsTabs, type DocsTabsRootProps } from '@chakra-docs/chakra'

interface TabProps {
  label: string
  children: ReactNode
}

export const TabList = DocsTabs.List
export const TabTrigger = DocsTabs.Trigger
export const TabContent = DocsTabs.Content

// <Tabs><Tab label="…">…</Tab></Tabs> is the compact MDX authoring form.
export function Tabs({ children, onValueChange, ...props }: DocsTabsRootProps) {
  const { trackEvent } = useFathom()
  const tabs = Children.toArray(children).filter(
    (child) => isValidElement<TabProps>(child) && child.type === Tab,
  )
  const firstTab = tabs[0]
  const defaultValue =
    props.defaultValue ??
    (isValidElement<TabProps>(firstTab) ? firstTab.props.label : undefined)

  return (
    <DocsTabs.Root
      {...props}
      defaultValue={defaultValue}
      onValueChange={(value) => {
        trackEvent(`docs-tab-select-${value}`)
        onValueChange?.(value)
      }}
    >
      {tabs.length > 0 ? (
        <>
          <DocsTabs.List>
            {tabs.map((tab) =>
              isValidElement<TabProps>(tab) ? (
                <DocsTabs.Trigger key={tab.props.label} value={tab.props.label}>
                  {tab.props.label}
                </DocsTabs.Trigger>
              ) : null,
            )}
          </DocsTabs.List>
          {tabs.map((tab) =>
            isValidElement<TabProps>(tab) ? (
              <DocsTabs.Content key={tab.props.label} value={tab.props.label}>
                {tab.props.children}
              </DocsTabs.Content>
            ) : null,
          )}
        </>
      ) : (
        children
      )}
    </DocsTabs.Root>
  )
}

export function Tab({ label, children }: TabProps) {
  return <DocsTabs.Content value={label}>{children}</DocsTabs.Content>
}
