// Re-export from source files to ensure single context instance
// This avoids module resolution issues with linked packages

// Re-export the built package entrypoints so the docs validate the published
// module graph instead of compiling the raw source tree.
export * from 'react-fathom'
export { useDebugSubscription } from 'react-fathom/debug'
