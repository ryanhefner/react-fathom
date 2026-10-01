import React from 'react'

import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { ColorModeButton } from '../../examples/shared/src/ColorModeButton'

const theme = vi.hoisted(() => ({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: vi.fn(),
}))
vi.mock('next-themes', () => ({ useTheme: () => theme }))

afterEach(() => {
  cleanup()
  theme.setTheme.mockClear()
})

describe('example color-mode button', () => {
  it.each(['dark', 'light'])(
    'toggles from the resolved %s mode when preference is system',
    async (mode) => {
      theme.resolvedTheme = mode
      render(
        <ChakraProvider value={testSystem}>
          <ColorModeButton />
        </ChakraProvider>,
      )
      const button = await screen.findByRole('button', {
        name: 'Toggle color mode',
      })
      await vi.waitFor(() => expect(button).toBeEnabled())
      fireEvent.click(button)
      expect(theme.setTheme).toHaveBeenCalledWith(
        mode === 'dark' ? 'light' : 'dark',
      )
    },
  )
})
