// WebView-based client (recommended for Fathom Pro)
export {
  FathomWebView,
  type FathomWebViewRef,
  type FathomWebViewProps,
} from './FathomWebView.js'
export {
  createWebViewClient,
  type WebViewClientOptions,
  type WebViewFathomClient,
  type WebViewRefSource,
} from './createWebViewClient.js'

// Provider components
export { NativeFathomProvider } from './NativeFathomProvider.js'
export { FathomProvider } from '../FathomProvider.js'

// Hooks
export { useFathom } from '../hooks/useFathom.js'
export { useAppStateTracking } from './useAppStateTracking.js'
export { useNavigationTracking } from './useNavigationTracking.js'

// Types
export type {
  NativeFathomProviderProps,
  NavigationContainerRefLike,
  UseNavigationTrackingOptions,
  UseAppStateTrackingOptions,
  // Re-exported from core
  FathomClient,
  EventOptions,
  LoadOptions,
  PageViewOptions,
} from './types.js'

export type { FathomContextInterface, FathomProviderProps } from '../types.js'
