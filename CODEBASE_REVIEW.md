# Codebase Review: react-fathom

**Date:** 2026-02-08
**Version:** 0.2.0

## Project Overview

**react-fathom** is a React wrapper library for [Fathom Analytics](https://usefathom.com/), a privacy-first analytics service. It provides:

- Automatic pageview tracking via declarative components and hooks
- Integrations for 6 frameworks: React, Next.js (App + Pages Router), React Router, Gatsby, TanStack Router, and React Native
- Full TypeScript support with strict typing
- Tree-shakeable builds (UMD, ESM, CJS)
- Debug mode with event stream UI
- React Native support via WebView with offline queuing

The codebase is well-organized across ~64 source files (~40 implementation + ~24 test files, ~8,300 lines total), with a Rollup build pipeline, Vitest test suite, CircleCI CI/CD, and a full Next.js documentation site.

---

## Architecture & Design (Strong)

**Strengths:**
- Clean separation of concerns: core provider, framework-specific adapters, hooks, and declarative components are each in their own modules
- Framework-agnostic core (`FathomProvider` + `FathomContext`) with per-framework adapters that compose on top
- Both declarative (`<TrackClick>`, `<TrackPageview>`, `<TrackVisible>`) and imperative (`useFathom()`) APIs
- Proper React patterns: Context, `useCallback`/`useMemo`, ref forwarding, `useImperativeHandle`
- `clientRef` prop allows parent access to the client instance, solving a common context limitation
- Nested provider support with option inheritance (shallow merge)

**Observations:**
- Multiple framework adapters each implement their own `buildUrl` function with near-identical logic (Next.js utils, React Router, Gatsby, TanStack Router). This is a clear opportunity to extract a shared URL-building utility.

---

## TypeScript & Type Safety (Strong)

The project uses `"strict": true` throughout with well-defined types exported for consumers.

**Minor issues:**

| Location | Issue |
|---|---|
| `src/native/useNavigationTracking.ts:60,82` | Uses `as any` type casts when traversing nested navigator state |
| `src/native/FathomWebView.tsx:182-186` | `error.message` in a catch block could be `undefined` if the thrown value isn't an `Error` |
| `src/types.ts:140` | `debug?: DebugOptions \| boolean` — the boolean shorthand mapping to `{ enabled: true, console: true }` could surprise users expecting `console: false` |

---

## Error Handling (Adequate, with gaps)

**What's covered:**
- `onError` callback on `FathomProvider` for catching tracking failures
- `safeClientCall` wrapper prevents unhandled exceptions in tracking methods
- Try-catch around debug subscriber notifications (`FathomProvider.tsx:118`)
- localStorage errors handled gracefully in `EventStream.tsx:114-116`
- React Native WebView message parsing wrapped in try-catch

**Gaps identified:**

1. **No `siteId` validation** — an empty string or `undefined` is silently accepted
2. **`FathomWebView.tsx:182-186`** — injected JS error handler accesses `error.message` without verifying the caught value is an `Error` instance
3. **`NativeFathomProvider.tsx:87-91`** — `client.setWebViewReady()` is not wrapped in try-catch
4. **`createWebViewClient.ts:95-98`** — when the command queue overflows `maxQueueSize`, the oldest command is silently dropped with only a debug log. No error callback is invoked.
5. **No rate limiting** on tracking calls — a malicious or buggy component could fire events in a tight loop
6. **No timeout** for WebView readiness in React Native — if the WebView never loads, queued commands sit indefinitely

---

## Security Concerns (Low Risk)

1. **`transformUrl` callbacks not validated** — In all router adapters (e.g., `ReactRouterFathomTrackView.tsx:111-117`), the return value of user-provided `transformUrl` is used directly without any validation. A misconfigured transform could inject unexpected values.

2. **Debug mode global event broadcasting** — `FathomProvider.tsx:87` dispatches `CustomEvent('react-fathom:debug', ...)` on `window`, which is globally accessible. If debug mode is accidentally enabled in production, tracking data leaks to any listener.

3. **WebView message origin** — `FathomWebView.tsx:212` processes incoming WebView messages without verifying origin.

4. **No input sanitization** on event names or goal parameters before sending to Fathom.

These are all low-severity given this is a client-side analytics library, but worth documenting.

---

## Potential Bugs

### Medium Priority

1. **Shared module-level debug event counter** (`FathomProvider.tsx:12-13`):
   ```typescript
   let debugEventCounter = 0
   const generateDebugEventId = () => `debug-${Date.now()}-${++debugEventCounter}`
   ```
   This counter is module-scoped, meaning multiple `FathomProvider` instances share it. Debug event IDs can collide across providers. Should be instance-scoped (e.g., via `useRef`).

2. **Unconditional console.log on mount** (`FathomProvider.tsx:57-60`):
   ```typescript
   useEffect(() => {
     console.log('[react-fathom] FathomProvider mounted, debugProp:', debugProp, ...)
   }, [])
   ```
   This logs on every provider mount regardless of whether debug mode is enabled.

3. **Race condition in `NativeFathomProvider`** — Multiple rapid `setWebViewReady()` calls could cause duplicate event processing from the queue.

### Low Priority

4. **`useTrackOnMount` suppresses exhaustive-deps** (line 23) — Intentionally fires only on mount, but if `options` changes dynamically, the stale closure won't pick it up.

5. **`EventStream` localStorage contention** (lines 131-139) — Multiple tabs writing simultaneously with no locking; last write wins.

6. **`useTrackOnVisible` `hasTracked` ref never resets** — If a component transitions from `trackOnce=false` to `trackOnce=true` after already tracking, it won't re-track.

---

## Test Coverage (Good)

- **24 test files** covering all major functionality
- `FathomProvider.test.tsx` alone is ~750 lines with comprehensive scenarios
- All hooks, components, and framework adapters have dedicated test files
- Uses Vitest + @testing-library/react + jsdom

**Gaps:**
- Error recovery paths are lightly tested (only ~4 tests for `onError` in `FathomProvider.test.tsx`)
- No tests for localStorage failures in `EventStream`
- No tests for malformed WebView messages
- No tests for queue overflow behavior in `createWebViewClient`

---

## Code Quality & Consistency (Strong)

**Positives:**
- Consistent style enforced by ESLint + Prettier (single quotes, no semicolons)
- Display names set on all components for React DevTools
- Good JSDoc comments with `@example` blocks
- Proper cleanup in all `useEffect` hooks (event listeners, observers)
- `useCallback`/`useMemo` used appropriately to prevent unnecessary re-renders

**Issues:**
- **Duplicate URL-building logic** across 4+ files (`next/utils.ts`, `ReactRouterFathomTrackView.tsx`, `GatsbyFathomTrackView.tsx`, `TanStackRouterFathomTrackView.tsx`) — should be extracted to a shared utility
- **Inconsistent error logging** — some files use `console.error`, others `console.warn`, some use both
- **`disableAutoTrack` naming** — negative boolean props (`disable*`) are harder to reason about than positive ones (`enableAutoTrack`)

---

## Build & Infrastructure (Solid)

- **Rollup** config handles 7 entry points across 3 output formats (UMD, ESM, CJS)
- **`add-use-client.js`** post-build script properly adds `'use client'` directives for Next.js RSC compatibility
- **CircleCI** runs build + tests with coverage reporting to Coveralls and Codecov
- **Tree-shaking** works correctly via package.json `exports` map with separate entry points per framework

---

## Performance (Good)

- IntersectionObserver used for visibility tracking with reasonable threshold (0.1)
- Queue management in React Native prevents unbounded memory growth
- Event listeners properly cleaned up

**Minor concerns:**
- `EventStream` accesses localStorage on every visibility toggle — could benefit from debouncing
- URL-building functions in router adapters are not memoized (reconstructed on every navigation)

---

## Summary

| Category | Rating | Notes |
|---|---|---|
| Architecture | Strong | Clean modular design with good separation |
| TypeScript | Strong | Strict mode, well-typed APIs, minor `any` casts |
| Error Handling | Adequate | Core paths covered; gaps in edge cases |
| Security | Low risk | Appropriate for client-side analytics lib |
| Testing | Good | 24 test files; some edge case gaps |
| Code Quality | Strong | Consistent style, proper React patterns |
| Build/Infra | Solid | Multi-format builds, CI/CD, coverage |

---

## Top Recommended Improvements

1. **Extract shared URL-building utility** to eliminate duplication across 4+ router adapters
2. **Make debug event counter instance-scoped** (use `useRef` instead of module-level variable)
3. **Remove unconditional `console.log` on provider mount** (or gate it behind debug mode check)
4. **Add `siteId` validation** (warn on empty/missing values)
5. **Add tests for edge cases**: error recovery, queue overflow, malformed WebView messages
6. **Add production warning** if debug mode is accidentally enabled
