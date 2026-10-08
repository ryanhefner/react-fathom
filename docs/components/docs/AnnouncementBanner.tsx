'use client'

import { useState, useEffect } from 'react'

import { LuArrowRight } from 'react-icons/lu'

import { useFathom } from '@/lib/fathom'
import { Box, CloseButton, Flex, Text, useSlotRecipe } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

interface AnnouncementBannerProps {
  id: string
  message: string
  linkText?: string
  linkHref?: string
  variant?: 'info' | 'warning' | 'success'
  dismissible?: boolean
}

export function AnnouncementBanner({
  id,
  message,
  linkText,
  linkHref,
  variant = 'info',
  dismissible = true,
}: AnnouncementBannerProps) {
  const styles = useSlotRecipe({ key: 'siteAnnouncement' })({ status: variant })
  const [isDismissed, setIsDismissed] = useState(true) // Start hidden to prevent flash
  const { trackEvent } = useFathom()
  const storageKey = `announcement-dismissed-${id}`

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const dismissed = localStorage.getItem(storageKey)
        setIsDismissed(dismissed === 'true')
      } catch {
        setIsDismissed(false)
      }
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [storageKey])

  const handleDismiss = () => {
    try {
      localStorage.setItem(storageKey, 'true')
    } catch {
      // Dismiss for this session even if browser storage is unavailable.
    }
    setIsDismissed(true)
    trackEvent('docs-announcement-dismiss')
  }

  if (isDismissed) {
    return null
  }

  return (
    <Box css={styles.root}>
      <Flex css={styles.content}>
        <Text css={styles.message}>
          {message}
          {linkText && linkHref && (
            <>
              {' '}
              <SiteLink href={linkHref} css={styles.link}>
                {linkText}
                <LuArrowRight aria-hidden="true" />
              </SiteLink>
            </>
          )}
        </Text>
        {dismissible && (
          <CloseButton
            size="sm"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            css={styles.close}
          />
        )}
      </Flex>
    </Box>
  )
}
