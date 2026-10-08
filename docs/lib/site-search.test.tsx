import React from 'react'

import { afterEach, expect, it, vi } from 'vitest'

import type { DocsSearchRecord } from '@chakra-docs/core'
import { ChakraProvider } from '@chakra-ui/react'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { DocsSiteSearch } from '../components/docs/DocsSiteSearch'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

afterEach(cleanup)

it('opens with six recommendations, searches all records, and restores recommendations on clear', async () => {
  const routes = [
    'getting-started',
    'react',
    'nextjs/app-router',
    'react-native',
    'api/hooks',
    'troubleshooting',
  ]
  const records: DocsSearchRecord[] = [...routes, 'unlisted'].map((route) => ({
    id: route,
    kind: 'page',
    collectionId: 'docs',
    route: '/docs/' + route,
    title: route,
    text: route,
    headings: [],
  }))
  render(
    <ChakraProvider value={testSystem}>
      <DocsSiteSearch records={records} />
    </ChakraProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: /search/i }))
  const titles = () =>
    screen.getAllByRole('option').map((option) => option.textContent)
  await waitFor(() => expect(titles()).toEqual(routes))
  expect(screen.getByRole('listbox', { name: 'Recommended' })).toBeTruthy()
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: 'unlisted' } })
  await waitFor(() => expect(titles()).toEqual(['unlisted']))
  fireEvent.click(screen.getByRole('button', { name: /clear search/i }))
  await waitFor(() => expect(titles()).toEqual(routes))
})
