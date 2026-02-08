import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { FathomProvider } from 'react-fathom'
import { TanStackRouterFathomTrackView } from 'react-fathom/tanstack-router'
import { ExampleLayoutSimple } from '@react-fathom/example-ui'

const siteId = import.meta.env.VITE_FATHOM_SITE_ID || 'DEMO'

// Custom Link component for ExampleLayoutSimple
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link to={to}>{children}</Link>
}

export const Route = createRootRoute({
  component: () => (
    <FathomProvider siteId={siteId} debug={{ enabled: true }}>
      <TanStackRouterFathomTrackView />
      <ExampleLayoutSimple
        linkComponent={NavLink}
        frameworkName="TanStack Router"
      >
        <Outlet />
      </ExampleLayoutSimple>
    </FathomProvider>
  ),
})
