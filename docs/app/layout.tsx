import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    default: 'react-fathom',
    template: '%s – react-fathom',
  },
  description: 'Privacy-focused analytics for React, Next.js, and React Native',
}

const navbar = (
  <Navbar
    logo={<span style={{ fontWeight: 700 }}>react-fathom</span>}
    projectLink="https://github.com/ryanhefner/react-fathom"
  />
)

const footer = <Footer>MIT {new Date().getFullYear()} © Ryan Hefner</Footer>

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/ryanhefner/react-fathom/tree/main/docs"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ backToTop: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
