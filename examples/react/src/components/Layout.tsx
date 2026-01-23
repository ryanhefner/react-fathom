import { Link as RouterLink, Outlet } from 'react-router-dom'
import { ExampleLayoutSimple } from '@react-fathom/example-ui'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Docs' },
  { href: '/events', label: 'Events Demo' },
]

export function Layout() {
  return (
    <ExampleLayoutSimple
      linkComponent={RouterLink}
      navLinks={navLinks}
      frameworkName="React + Vite"
    >
      <Outlet />
    </ExampleLayoutSimple>
  )
}
