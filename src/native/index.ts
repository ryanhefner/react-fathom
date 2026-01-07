// WebView-based client (recommended for Fathom Pro)
export { FathomWebView, type FathomWebViewRef, type FathomWebViewProps } from './FathomWebView'
export { createWebViewClient, type WebViewFathomClient, type WebViewClientOptions } from './createWebViewClient'

// Provider components
export { NativeFathomProvider } from './NativeFathomProvider'
export { FathomProvider } from '../FathomProvider'

// Hooks
export { useFathom } from '../hooks/useFathom'
export { useAppStateTracking } from './useAppStateTracking'
export { useNavigationTracking } from './useNavigationTracking'

// Types
export type {
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
