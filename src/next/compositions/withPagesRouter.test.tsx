import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { withPagesRouter } from './withPagesRouter'

// Mock NextFathomProviderPages
vi.mock('../NextFathomProviderPages', () => ({
  default: ({
    children,
    siteId,
  }: {
    children: React.ReactNode
    siteId?: string
  }) => (
    <div data-testid="pages-provider" data-site-id={siteId}>
      {children}
    </div>
  ),
}))

describe('withPagesRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should wrap component with NextFathomProviderPages', () => {
    const TestComponent = ({ name }: { name: string }) => (
      <div>Hello {name}</div>
    )

    const WrappedComponent = withPagesRouter(TestComponent, {
      siteId: 'TEST_SITE_ID',
    })

    render(<WrappedComponent name="World" />)

    expect(screen.getByTestId('pages-provider')).toBeInTheDocument()
    expect(screen.getByTestId('pages-provider')).toHaveAttribute(
      'data-site-id',
      'TEST_SITE_ID',
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should pass props to wrapped component', () => {
    const TestComponent = ({ count }: { count: number }) => (
      <div>Count: {count}</div>
    )

    const WrappedComponent = withPagesRouter(TestComponent)

    render(<WrappedComponent count={42} />)

    expect(screen.getByText('Count: 42')).toBeInTheDocument()
  })

  it('should pass provider props to NextFathomProviderPages', () => {
    const TestComponent = () => <div>Test</div>

    const WrappedComponent = withPagesRouter(TestComponent, {
      siteId: 'TEST_SITE_ID',
      disableAutoTrack: true,
      clientOptions: { honorDNT: true },
    })

    render(<WrappedComponent />)

    expect(screen.getByTestId('pages-provider')).toBeInTheDocument()
  })

  it('should work without provider props', () => {
    const TestComponent = () => <div>Test</div>

    const WrappedComponent = withPagesRouter(TestComponent)

    render(<WrappedComponent />)

    expect(screen.getByTestId('pages-provider')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should set displayName correctly', () => {
    const TestComponent = () => <div>Test</div>
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withPagesRouter(TestComponent)

    expect(WrappedComponent.displayName).toBe('withPagesRouter(TestComponent)')
  })

  it('should set displayName with component name when displayName is not set', () => {
    function TestComponent() {
      return <div>Test</div>
    }

    const WrappedComponent = withPagesRouter(TestComponent)

    expect(WrappedComponent.displayName).toBe('withPagesRouter(TestComponent)')
  })

  it('should set displayName with Component fallback', () => {
    const TestComponent = () => <div>Test</div>
    // Remove displayName and name
    Object.defineProperty(TestComponent, 'name', { value: '' })

    const WrappedComponent = withPagesRouter(TestComponent)

    expect(WrappedComponent.displayName).toBe('withPagesRouter(Component)')
  })
})
