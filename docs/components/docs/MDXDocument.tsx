'use client'

import type { ReactNode } from 'react'

import { Prose } from '@postkit/react'

export function MDXDocument({ children }: { children: ReactNode }) {
  return <Prose>{children}</Prose>
}
