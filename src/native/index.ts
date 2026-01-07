// Client factory
export { createNativeClient, type NativeFathomClient } from './createNativeClient'

// Provider component
export { NativeFathomProvider } from './NativeFathomProvider'

// Hooks
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
