'use client'

import { DocsCards, type DocsCardsRootProps } from '@chakra-docs/chakra'

// Preserve the short names used by authored MDX; styling belongs to Chakra Docs.
export const Card = DocsCards.Card

export function Cards({
  cols,
  ...props
}: DocsCardsRootProps & { cols?: number }) {
  return (
    <DocsCards.Root
      {...props}
      slotProps={
        cols
          ? {
              gridTemplateColumns: {
                base: 'minmax(0, 1fr)',
                md: `repeat(${cols}, minmax(0, 1fr))`,
              },
              ...props.slotProps,
            }
          : props.slotProps
      }
    />
  )
}
