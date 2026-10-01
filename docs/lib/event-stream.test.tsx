import React from 'react'

import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { EventStream } from '../components/docs/EventStream'

const storageKey = 'react-fathom-event-stream-visible'

function renderStream() {
  return render(
    <ChakraProvider value={testSystem}>
      <EventStream forceShow />
    </ChakraProvider>,
  )
}

describe('documentation event stream disclosure', () => {
  beforeEach(() => {
    localStorage.clear()
    // Presence retains the browser's live computed-style object. jsdom instead
    // returns a snapshot, so model live properties for the animation lifecycle.
    const original = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      (element) =>
        new Proxy(original(element), {
          get(_target, property) {
            const current = original(element)
            const value = Reflect.get(current, property)
            return typeof value === 'function' ? value.bind(current) : value
          },
        }),
    )
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('animates both directions and unmounts only after its exit animation', async () => {
    renderStream()
    const toggle = await screen.findByRole('button', {
      name: 'Show event stream',
    })
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()

    fireEvent.click(toggle)
    const panel = await screen.findByRole('complementary', {
      name: 'Event stream',
    })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('data-state', 'open')
    expect(panel).not.toHaveAttribute('inert')
    const styles = getComputedStyle(panel)
    expect(styles.animationName).toBe('slide-from-right-full')
    expect(styles.animationDuration).toBe(
      testSystem.token.var('durations.eventStreamPanel'),
    )
    expect(styles.animationTimingFunction).toBe(
      testSystem.token.var('easings.snappy'),
    )
    expect(testSystem.token('durations.eventStreamPanel')).toBe('200ms')
    expect(testSystem.token('easings.snappy')).toBe(
      'cubic-bezier(0.4, 0, 0.2, 1)',
    )

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panel).toHaveAttribute('data-state', 'closed')
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(panel).toHaveAttribute('inert')
    expect(getComputedStyle(panel).animationName).toBe('slide-to-right-full')
    expect(panel).toBeInTheDocument()

    // Presence observes the new animation on the next animation frame.
    await waitFor(() => expect(panel.style.animationFillMode).toBe('forwards'))
    fireEvent.animationEnd(panel, { animationName: 'slide-to-right-full' })
    await waitFor(() => expect(panel).not.toBeInTheDocument())
    expect(localStorage.getItem(storageKey)).toBe('false')
  })

  it('restores focus when closing from inside the panel with the keyboard shortcut', async () => {
    localStorage.setItem(storageKey, 'true')
    renderStream()
    const toggle = await screen.findByRole('button', {
      name: 'Hide event stream',
    })
    const panel = await screen.findByRole('complementary')
    fireEvent(
      window,
      new CustomEvent('react-fathom:debug', {
        detail: { id: 'test', type: 'event', eventName: 'test', timestamp: 0 },
      }),
    )
    const clear = screen.getByRole('button', { name: 'Clear' })
    clear.focus()
    expect(clear).toHaveFocus()
    fireEvent.keyDown(document, { key: '.', ctrlKey: true })
    expect(toggle).toHaveFocus()
    expect(panel).toHaveAttribute('inert')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(panel.style.animationFillMode).toBe('forwards'))

    // Reopening before the exit finishes must cancel the pending dismissal.
    fireEvent.keyDown(document, { key: '.', metaKey: true })
    expect(panel).toHaveAttribute('data-state', 'open')
    expect(panel).not.toHaveAttribute('inert')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(localStorage.getItem(storageKey)).toBe('true')
    fireEvent.animationEnd(panel, { animationName: 'slide-to-right-full' })
    expect(panel).toBeInTheDocument()
  })

  it('disables panel and card animations for reduced-motion users', async () => {
    renderStream()
    fireEvent.click(
      await screen.findByRole('button', { name: 'Show event stream' }),
    )
    await screen.findByRole('complementary')
    fireEvent(
      window,
      new CustomEvent('react-fathom:debug', {
        detail: { id: 'test', type: 'event', eventName: 'test', timestamp: 0 },
      }),
    )
    const css = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules, (rule) => rule.cssText))
      .join('\n')
    expect(css).toMatch(/prefers-reduced-motion: reduce/)
    expect(css.match(/animation: none/g)?.length).toBeGreaterThanOrEqual(2)
  })
})
