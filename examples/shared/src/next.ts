'use client'

import { createElement, type ComponentProps } from 'react'

import NextLink from 'next/link'

import { ExampleLayout } from './ExampleLayout'

export { ExampleProviderNext } from './ExampleProviderNext'
export type { ExampleProviderNextProps } from './ExampleProviderNext'

export { ColorModeButton } from './ColorModeButton'

export { ExampleLayout } from './ExampleLayout'
export type { ExampleLayoutProps, NavLink } from './ExampleLayout'

export type ExampleLayoutNextProps = Omit<
  ComponentProps<typeof ExampleLayout>,
  'linkComponent'
>

/**
 * Next.js layout adapter that keeps the framework Link component inside the
 * client boundary instead of passing a function from a Server Component.
 */
export function ExampleLayoutNext(props: ExampleLayoutNextProps) {
  return createElement(ExampleLayout, { ...props, linkComponent: NextLink })
}
