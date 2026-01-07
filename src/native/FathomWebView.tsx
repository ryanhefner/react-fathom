import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView, type WebViewMessageEvent } from 'react-native-webview'

import type { EventOptions, PageViewOptions, LoadOptions } from '../types'

export interface FathomWebViewRef {
  trackPageview: (opts?: PageViewOptions) => void
  trackEvent: (eventName: string, opts?: EventOptions) => void
  trackGoal: (code: string, cents: number) => void
  blockTrackingForMe: () => void
  enableTrackingForMe: () => void
  isReady: () => boolean
}

export interface FathomWebViewProps {
  /**
   * Your Fathom Analytics site ID
   */
  siteId: string

  /**
   * Options passed to fathom.load()
   */
  loadOptions?: LoadOptions

  /**
   * Custom domain for Fathom script (if using custom domains feature)
   * @default 'cdn.usefathom.com'
   */
  scriptDomain?: string

  /**
   * Called when the Fathom script has loaded and is ready
   */
  onReady?: () => void

  /**
   * Called when an error occurs loading the script
   */
  onError?: (error: string) => void

  /**
   * Enable debug logging
   */
  debug?: boolean
}

/**
 * Hidden WebView component that loads and manages the Fathom Analytics script.
 *
 * This component renders an invisible WebView that loads the official Fathom
 * tracking script, allowing React Native apps to use Fathom's full functionality.
 *
 * @example
 * ```tsx
 * const fathomRef = useRef<FathomWebViewRef>(null)
 *
 * <FathomWebView
 *   ref={fathomRef}
 *   siteId="ABCDEFGH"
 *   onReady={() => console.log('Fathom ready!')}
 * />
 *
 * // Later, track events:
 * fathomRef.current?.trackPageview({ url: '/home' })
 * ```
 */
export const FathomWebView = forwardRef<FathomWebViewRef, FathomWebViewProps>(
  function FathomWebView(
    {
      siteId,
      loadOptions = {},
      scriptDomain = 'cdn.usefathom.com',
      onReady,
      onError,
      debug = false,
    },
    ref,
  ) {
    const webViewRef = useRef<WebView>(null)
    const [isReady, setIsReady] = useState(false)

    const log = useCallback(
      (...args: unknown[]) => {
        if (debug) {
          console.log('[react-fathom/webview]', ...args)
        }
      },
      [debug],
    )

    // Build data attributes for load options
    const buildDataAttributes = useCallback(() => {
      const attrs: string[] = [`data-site="${siteId}"`]

      if (loadOptions.auto === false) {
        attrs.push('data-auto="false"')
      }
      if (loadOptions.honorDNT) {
        attrs.push('data-honor-dnt="true"')
      }
      if (loadOptions.canonical === false) {
        attrs.push('data-canonical="false"')
      }
      if (loadOptions.spa) {
        attrs.push(`data-spa="${loadOptions.spa}"`)
      }

      return attrs.join(' ')
    }, [siteId, loadOptions])

    // HTML content that loads the Fathom script
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://${scriptDomain}/script.js" ${buildDataAttributes()} defer></script>
          <script>
            // Wait for Fathom to be available
            function waitForFathom(callback, maxAttempts = 50) {
              let attempts = 0;
              const check = () => {
                attempts++;
                if (typeof window.fathom !== 'undefined') {
                  callback();
                } else if (attempts < maxAttempts) {
                  setTimeout(check, 100);
                } else {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    message: 'Fathom script failed to load after ' + (maxAttempts * 100) + 'ms'
                  }));
                }
              };
              check();
            }

            // Initialize when DOM is ready
            document.addEventListener('DOMContentLoaded', () => {
              waitForFathom(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'ready'
                }));
              });
            });

            // Handle commands from React Native
            window.handleCommand = function(command) {
              if (typeof window.fathom === 'undefined') {
                console.warn('Fathom not loaded yet');
                return;
              }

              try {
                switch (command.action) {
                  case 'trackPageview':
                    window.fathom.trackPageview(command.options || {});
                    break;
                  case 'trackEvent':
                    window.fathom.trackEvent(command.eventName, command.options || {});
                    break;
                  case 'trackGoal':
                    window.fathom.trackGoal(command.code, command.cents);
                    break;
                  case 'blockTrackingForMe':
                    window.fathom.blockTrackingForMe();
                    break;
                  case 'enableTrackingForMe':
                    window.fathom.enableTrackingForMe();
                    break;
                  default:
                    console.warn('Unknown command:', command.action);
                }
              } catch (error) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  message: error.message
                }));
              }
            };
          </script>
        </head>
        <body></body>
      </html>
    `

    const injectCommand = useCallback(
      (command: Record<string, unknown>) => {
        if (!webViewRef.current) {
          log('WebView not available')
          return
        }

        const script = `window.handleCommand(${JSON.stringify(command)}); true;`
        webViewRef.current.injectJavaScript(script)
        log('Injected command:', command)
      },
      [log],
    )

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data)

          switch (data.type) {
            case 'ready':
              log('Fathom script loaded and ready')
              setIsReady(true)
              onReady?.()
              break
            case 'error':
              log('Error from WebView:', data.message)
              onError?.(data.message)
              break
            default:
              log('Unknown message type:', data.type)
          }
        } catch {
          log('Failed to parse WebView message:', event.nativeEvent.data)
        }
      },
      [log, onReady, onError],
    )

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        trackPageview: (opts?: PageViewOptions) => {
          injectCommand({ action: 'trackPageview', options: opts })
        },
        trackEvent: (eventName: string, opts?: EventOptions) => {
          injectCommand({ action: 'trackEvent', eventName, options: opts })
        },
        trackGoal: (code: string, cents: number) => {
          injectCommand({ action: 'trackGoal', code, cents })
        },
        blockTrackingForMe: () => {
          injectCommand({ action: 'blockTrackingForMe' })
        },
        enableTrackingForMe: () => {
          injectCommand({ action: 'enableTrackingForMe' })
        },
        isReady: () => isReady,
      }),
      [injectCommand, isReady],
    )

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            log('WebView error:', nativeEvent)
            onError?.(nativeEvent.description || 'WebView error')
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // Hide the WebView completely
          style={styles.webview}
          // Prevent any user interaction
          scrollEnabled={false}
          bounces={false}
          // Optimize for background operation
          cacheEnabled={true}
          incognito={false}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
  webview: {
    width: 1,
    height: 1,
    opacity: 0,
  },
})
