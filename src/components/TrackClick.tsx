import React from 'react'
import type { ElementType, MouseEvent, ReactNode } from 'react'

import type { EventOptions } from 'fathom-client'

import { useFathom } from '../hooks/useFathom'

export interface TrackClickProps extends EventOptions {
  /**
   * Event name to track
   */
  eventName: string
  /**
   * Child element(s) to wrap
   */
  children: ReactNode
  /**
   * Whether to prevent default behavior
   * @default false
   */
  preventDefault?: boolean
  /**
   * Custom onClick handler (will be called before tracking)
   */
  onClick?: (e: MouseEvent) => void
  /**
   * HTML element to render as wrapper
   * @default 'div'
   */
  as?: ElementType
}

/**
 * Component wrapper that automatically tracks clicks on its children
 *
 * @example
 * ```tsx
 * <TrackClick eventName="cta-clicked" id="hero-cta">
 *   <button>Get Started</button>
 * </TrackClick>
 * ```
 */
export const TrackClick: React.FC<TrackClickProps> = ({
  eventName,
  children,
  preventDefault = false,
  onClick,
  as: Component = 'div',
  ...eventOptions
}) => {
  const { trackEvent } = useFathom()

  const handleClick = (e: MouseEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }
    onClick?.(e)
    trackEvent?.(eventName, eventOptions)
  }

  return <Component onClick={handleClick}>{children}</Component>
}
