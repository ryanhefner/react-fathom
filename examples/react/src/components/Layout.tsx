import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useFathom } from 'react-fathom'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Docs' },
  { href: '/events', label: 'Events Demo' },
]

export function Layout() {
  const location = useLocation()
  const { trackPageview } = useFathom()

  // Track pageviews on route change
  useEffect(() => {
    trackPageview()
  }, [location.pathname, trackPageview])

  return (
    <Box minH="100vh">
      <Box as="header" borderBottomWidth="1px" bg="bg">
        <Container maxW="container.lg" py={4}>
          <Flex justify="space-between" align="center">
            <Link as={RouterLink} to="/" fontWeight="bold" fontSize="lg" _hover={{ textDecoration: 'none' }}>
              react-fathom
            </Link>
            <HStack as="nav" gap={6}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  as={RouterLink}
                  to={item.href}
                  color={location.pathname === item.href ? 'fg' : 'fg.muted'}
                  fontWeight={location.pathname === item.href ? 'medium' : 'normal'}
                  _hover={{ color: 'fg' }}
                >
                  {item.label}
                </Link>
              ))}
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container as="main" maxW="container.lg" py={8}>
        <Outlet />
      </Container>

      <Box as="footer" borderTopWidth="1px" py={6}>
        <Container maxW="container.lg">
          <Text fontSize="sm" color="fg.muted" textAlign="center">
            react-fathom React Example — Privacy-focused analytics
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
