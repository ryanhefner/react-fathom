import React from 'react'

import '@testing-library/jest-dom/vitest'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { AccordionItem } from '../components/docs/Accordion'
import { AnnouncementBanner } from '../components/docs/AnnouncementBanner'
import { File, FileTree, Folder } from '../components/docs/FileTree'

const { trackEvent } = vi.hoisted(() => ({ trackEvent: vi.fn() }))
vi.mock('@/lib/fathom', () => ({ useFathom: () => ({ trackEvent }) }))

describe('Chakra-backed documentation disclosures', () => {
  beforeEach(() => {
    localStorage.clear()
    trackEvent.mockClear()
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('connects disclosure triggers to unique content regions and retains analytics', async () => {
    render(
      <ChakraProvider value={testSystem}>
        <AccordionItem title="First">First content</AccordionItem>
        <AccordionItem title="Second" defaultOpen>
          Second content
        </AccordionItem>
      </ChakraProvider>,
    )
    const first = screen.getByRole('button', { name: 'First' })
    const second = screen.getByRole('button', { name: 'Second' })
    expect(first).toHaveAttribute('type', 'button')
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(second).toHaveAttribute('aria-expanded', 'true')
    first.focus()
    expect(first).toHaveFocus()
    await act(async () => {
      fireEvent.click(first)
    })
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(
      document.getElementById(first.getAttribute('aria-controls')!),
    ).toHaveTextContent('First content')
    expect(first.getAttribute('aria-controls')).not.toBe(
      second.getAttribute('aria-controls'),
    )
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(trackEvent).toHaveBeenCalledWith('docs-accordion-expand')
    const secondContent = document.getElementById(
      second.getAttribute('aria-controls')!,
    )!
    await act(async () => {
      fireEvent.click(second)
    })
    expect(second).toHaveAttribute('data-state', 'closed')
    await waitFor(() =>
      expect(secondContent.style.animationFillMode).toBe('forwards'),
    )
    await act(async () => {
      fireEvent.animationEnd(secondContent)
    })
    expect(second).toHaveAttribute('aria-expanded', 'false')
    expect(trackEvent).toHaveBeenCalledWith('docs-accordion-collapse')
  })

  it('uses accessible file-tree disclosures without focusable empty folders', async () => {
    render(
      <ChakraProvider value={testSystem}>
        <FileTree>
          <Folder name="src" defaultOpen={false}>
            <File name="index.ts" />
          </Folder>
          <Folder name="empty" />
        </FileTree>
      </ChakraProvider>,
    )
    expect(
      screen.queryByRole('button', { name: 'empty' }),
    ).not.toBeInTheDocument()
    const folder = screen.getByRole('button', { name: 'src' })
    expect(folder).toHaveAttribute('aria-expanded', 'false')
    await act(async () => {
      fireEvent.click(folder)
    })
    expect(folder).toHaveAttribute('aria-expanded', 'true')
    expect(
      document.getElementById(folder.getAttribute('aria-controls')!),
    ).toHaveTextContent('index.ts')
    expect(trackEvent).toHaveBeenCalledWith('docs-file-tree-expand')
  })

  it('dismisses themed announcements even when localStorage cannot be written', async () => {
    render(
      <ChakraProvider value={testSystem}>
        <AnnouncementBanner
          id="test"
          message="A new release"
          variant="warning"
        />
      </ChakraProvider>,
    )
    const dismiss = await screen.findByRole('button', {
      name: 'Dismiss announcement',
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    fireEvent.click(dismiss)
    await waitFor(() =>
      expect(screen.queryByText('A new release')).not.toBeInTheDocument(),
    )
    expect(trackEvent).toHaveBeenCalledWith('docs-announcement-dismiss')
  })
})
