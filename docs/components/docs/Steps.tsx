'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface StepsProps {
  children: ReactNode
}

export function Steps({ children }: StepsProps) {
  return (
    <Box my={6} pl={4} borderLeftWidth="2px" borderLeftColor="gray.200" _dark={{ borderLeftColor: 'gray.700' }}>
      {children}
    </Box>
  )
}

interface StepProps {
  title: string
  children: ReactNode
}

export function Step({ title, children }: StepProps) {
  return (
    <Box position="relative" pb={6} _last={{ pb: 0 }}>
      <Box
        position="absolute"
        left="-21px"
        top="0"
        width="10px"
        height="10px"
        borderRadius="full"
        bg="blue.500"
      />
      <Text fontWeight="semibold" mb={2}>{title}</Text>
      <Box color="fg.muted" css={{ '& p': { margin: 0 } }}>
        {children}
      </Box>
    </Box>
  )
}
