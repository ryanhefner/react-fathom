/**
 * Minimal type declarations for react-native modules used by react-fathom/native.
 * This allows the package to compile without requiring react-native as a dev dependency.
 */
declare module 'react-native' {
  export type AppStateStatus = 'active' | 'background' | 'inactive'

  export interface AppStateStatic {
    currentState: AppStateStatus
    addEventListener(
      event: 'change',
      handler: (state: AppStateStatus) => void,
    ): { remove: () => void }
  }

  export const AppState: AppStateStatic

  export interface ViewStyle {
    position?: 'absolute' | 'relative'
    width?: number | string
    height?: number | string
    overflow?: 'visible' | 'hidden' | 'scroll'
    opacity?: number
  }

  export interface StyleSheetStatic {
    create<T extends Record<string, ViewStyle>>(styles: T): T
  }

  export const StyleSheet: StyleSheetStatic

  export interface ViewProps {
    style?: ViewStyle
    children?: React.ReactNode
  }

  export const View: React.FC<ViewProps>
}

declare module 'react-native-webview' {
  import type { RefObject } from 'react'

  export interface WebViewMessageEvent {
    nativeEvent: {
      data: string
    }
  }

  export interface WebViewErrorEvent {
    nativeEvent: {
      description?: string
      code?: number
      domain?: string
      url?: string
    }
  }

  export interface WebViewProps {
    ref?: RefObject<WebView>
    source?: { html: string; uri?: never } | { uri: string; html?: never }
    onMessage?: (event: WebViewMessageEvent) => void
    onError?: (event: WebViewErrorEvent) => void
    javaScriptEnabled?: boolean
    domStorageEnabled?: boolean
    style?: Record<string, unknown>
    scrollEnabled?: boolean
    bounces?: boolean
    cacheEnabled?: boolean
    incognito?: boolean
  }

  export class WebView extends React.Component<WebViewProps> {
    injectJavaScript(script: string): void
  }
}
