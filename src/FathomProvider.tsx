'use client'

import React, { useCallback, useContext, useEffect, useMemo } from 'react'

import * as Fathom from 'fathom-client'
import type { EventOptions, LoadOptions, PageViewOptions } from 'fathom-client'

import { FathomContext } from './FathomContext'
import type { FathomProviderProps } from './types'

const FathomProvider: React.FC<FathomProviderProps> = ({
  children,
  client: providedClient,
  clientRef,
  clientOptions,
  siteId,
  defaultPageviewOptions: providedDefaultPageviewOptions,
  defaultEventOptions: providedDefaultEventOptions,
}) => {
  // Read parent context if it exists
  const parentContext = useContext(FathomContext)

  // Use provided client or fall back to parent client or default Fathom
  const client = useMemo(
    () => providedClient ?? parentContext.client ?? Fathom,
    [providedClient, parentContext.client],
  )

  // Merge defaultPageviewOptions: parent + provided (provided overrides parent)
  const defaultPageviewOptions = useMemo(
    () => ({
      ...parentContext.defaultPageviewOptions,
      ...providedDefaultPageviewOptions,
    }),
    [providedDefaultPageviewOptions, parentContext.defaultPageviewOptions],
  )

  // Merge defaultEventOptions: parent + provided (provided overrides parent)
  const defaultEventOptions = useMemo(
    () => ({
      ...parentContext.defaultEventOptions,
      ...providedDefaultEventOptions,
    }),
    [providedDefaultEventOptions, parentContext.defaultEventOptions],
  )

  const blockTrackingForMe = useCallback(() => {
    client.blockTrackingForMe()
  }, [client])

  const enableTrackingForMe = useCallback(() => {
    client.enableTrackingForMe()
  }, [client])

  const isTrackingEnabled = useCallback(() => {
    return client.isTrackingEnabled() ?? false
  }, [client])

  const load = useCallback(
    (siteId: string, clientOptions?: LoadOptions) => {
      client.load(siteId, clientOptions)
    },
    [client],
  )

  const setSite = useCallback(
    (siteId: string) => {
      client.setSite(siteId)
    },
    [client],
  )

  const trackEvent = useCallback(
    (eventName: string, options?: EventOptions) => {
      client.trackEvent(eventName, {
        ...defaultEventOptions,
        ...options,
      })
    },
    [client, defaultEventOptions],
  )

  const trackPageview = useCallback(
    (options?: PageViewOptions) => {
      client.trackPageview({
        ...defaultPageviewOptions,
        ...options,
      })
    },
    [client, defaultPageviewOptions],
  )

  const trackGoal = useCallback(
    (code: string, cents: number) => {
      client.trackGoal(code, cents)
    },
    [client],
  )

  useEffect(() => {
    if (siteId !== undefined) {
      load(siteId, clientOptions)
    }
  }, [clientOptions, load, siteId])

  // Populate the clientRef so the parent component can access the client
  useEffect(() => {
    if (clientRef) {
      clientRef.current = client
    }
  }, [client, clientRef])

  return (
    <FathomContext.Provider
      value={{
        blockTrackingForMe,
        enableTrackingForMe,
        isTrackingEnabled,
        load,
        setSite,
        trackEvent,
        trackGoal,
        trackPageview,
        client,
        defaultPageviewOptions,
        defaultEventOptions,
      }}
    >
      {children}
    </FathomContext.Provider>
  )
}

FathomProvider.displayName = 'FathomProvider'

export { FathomProvider }
