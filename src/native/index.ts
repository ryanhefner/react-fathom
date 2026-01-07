// Client factory
export { createNativeClient, type NativeFathomClient } from './createNativeClient'

// Provider components
export { NativeFathomProvider } from './NativeFathomProvider'
export { FathomProvider } from '../FathomProvider'

// Hooks
export { useFathom } from '../hooks/useFathom'
export { useAppStateTracking } from './useAppStateTracking'
export { useNavigationTracking } from './useNavigationTracking'

// Types
export type {
  NativeClientOptions,
  NativeFathomProviderProps,
  UseNavigationTrackingOptions,
  UseAppStateTrackingOptions,
  // Re-exported from core
  FathomClient,
  EventOptions,
  LoadOptions,
  PageViewOptions,
} from './types'

export type {
  FathomContextInterface,
  FathomProviderProps,
} from '../types'
