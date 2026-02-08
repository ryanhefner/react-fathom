'use client'

import { Box, CloseButton, Flex, Link, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'

interface AnnouncementBannerProps {
  id: string
  message: string
  linkText?: string
  linkHref?: string
  variant?: 'info' | 'warning' | 'success'
  dismissible?: boolean
}

const variantStyles = {
  info: {
    bg: 'blue.600',
    color: 'white',
  },
  warning: {
    bg: 'yellow.500',
    color: 'black',
  },
  success: {
    bg: 'green.600',
    color: 'white',
  },
}

export function AnnouncementBanner({
  id,
  message,
  linkText,
  linkHref,
  variant = 'info',
  dismissible = true,
}: AnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true) // Start hidden to prevent flash
  const storageKey = `announcement-dismissed-${id}`

  useEffect(() => {
    // Check localStorage after mount
    const dismissed = localStorage.getItem(storageKey)
    setIsDismissed(dismissed === 'true')
  }, [storageKey])

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true')
    setIsDismissed(true)
  }

  if (isDismissed) {
    return null
  }

  const styles = variantStyles[variant]

  return (
    <Box bg={styles.bg} color={styles.color} py={2} px={4}>
      <Flex
        maxW="container.xl"
        mx="auto"
        align="center"
        justify="center"
        gap={2}
        position="relative"
      >
        <Text fontSize="sm" fontWeight="medium" textAlign="center">
          {message}
          {linkText && linkHref && (
            <>
              {' '}
              <Link
                href={linkHref}
                textDecoration="underline"
                fontWeight="semibold"
                _hover={{ opacity: 0.8 }}
              >
                {linkText} →
              </Link>
            </>
          )}
        </Text>
        {dismissible && (
          <CloseButton
            size="sm"
            position="absolute"
            right={0}
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            _hover={{ bg: 'whiteAlpha.200' }}
          />
        )}
      </Flex>
    </Box>
  )
}
