import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { withAppRouter } from './withAppRouter'

// Mock NextFathomProviderApp
vi.mock('../NextFathomProviderApp', () => ({
  default: ({
    children,
    siteId,
  }: {
    children: React.ReactNode
    siteId?: string
  }) => (
    <div data-testid="app-provider" data-site-id={siteId}>
      {children}
    </div>
  ),
}))

describe('withAppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should wrap component with NextFathomProviderApp', () => {
    const TestComponent = ({ name }: { name: string }) => (
      <div>Hello {name}</div>
    )

    const WrappedComponent = withAppRouter(TestComponent, {
      siteId: 'TEST_SITE_ID',
    })

    render(<WrappedComponent name="World" />)

    expect(screen.getByTestId('app-provider')).toBeInTheDocument()
    expect(screen.getByTestId('app-provider')).toHaveAttribute(
      'data-site-id',
      'TEST_SITE_ID',
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should pass props to wrapped component', () => {
    const TestComponent = ({ count }: { count: number }) => (
      <div>Count: {count}</div>
    )

    const WrappedComponent = withAppRouter(TestComponent)

    render(<WrappedComponent count={42} />)

    expect(screen.getByText('Count: 42')).toBeInTheDocument()
  })

  it('should pass provider props to NextFathomProviderApp', () => {
    const TestComponent = () => <div>Test</div>

    const WrappedComponent = withAppRouter(TestComponent, {
      siteId: 'TEST_SITE_ID',
      disableAutoTrack: true,
      clientOptions: { honorDNT: true },
    })

    render(<WrappedComponent />)

    expect(screen.getByTestId('app-provider')).toBeInTheDocument()
  })

  it('should work without provider props', () => {
    const TestComponent = () => <div>Test</div>

    const WrappedComponent = withAppRouter(TestComponent)

    render(<WrappedComponent />)

    expect(screen.getByTestId('app-provider')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should set displayName correctly', () => {
    const TestComponent = () => <div>Test</div>
    TestComponent.displayName = 'TestComponent'

    const WrappedComponent = withAppRouter(TestComponent)

    expect(WrappedComponent.displayName).toBe('withAppRouter(TestComponent)')
  })

  it('should set displayName with component name when displayName is not set', () => {
    function TestComponent() {
      return <div>Test</div>
    }

    const WrappedComponent = withAppRouter(TestComponent)

    expect(WrappedComponent.displayName).toBe('withAppRouter(TestComponent)')
  })

  it('should set displayName with Component fallback', () => {
    const TestComponent = () => <div>Test</div>
    // Remove displayName and name
    Object.defineProperty(TestComponent, 'name', { value: '' })

    const WrappedComponent = withAppRouter(TestComponent)

    expect(WrappedComponent.displayName).toBe('withAppRouter(Component)')
  })
})
