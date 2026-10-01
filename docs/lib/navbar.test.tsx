import React from 'react'

import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render, screen } from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { Navbar } from '../components/docs/Navbar'

vi.mock('../components/docs/DocsSiteSearch', () => ({
  DocsSiteSearch: () => <button type="button">Search documentation</button>,
}))

afterEach(cleanup)

describe('site header', () => {
  it('keeps the brand, search, and GitHub without Docs or API navigation links', () => {
    render(
      <ChakraProvider value={testSystem}>
        <Navbar searchRecords={[]} />
      </ChakraProvider>,
    )
    expect(screen.getByRole('link', { name: 'react-fathom' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.getByRole('button', { name: 'Search documentation' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View react-fathom on GitHub' }),
    ).toHaveAttribute('href', 'https://github.com/ryanhefner/react-fathom')
    expect(screen.queryByRole('link', { name: 'Docs' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'API' })).not.toBeInTheDocument()
  })
})
