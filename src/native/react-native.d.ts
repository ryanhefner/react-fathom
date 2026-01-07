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
}
