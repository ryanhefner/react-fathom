'use client'

import type { ReactNode } from 'react'

import { chakraDocsRecipeKeys } from '@chakra-docs/chakra/theme'
import { Stack, useSlotRecipe } from '@chakra-ui/react'

export function MDXDocument({ children }: { children: ReactNode }) {
  const recipe = useSlotRecipe({ key: chakraDocsRecipeKeys.markdownContent })
  const styles = recipe()

  return <Stack css={styles.root}>{children}</Stack>
}
