'use client'

import { Fragment } from 'react'

import type { MDXComponents as MDXComponentsType } from 'mdx/types'

import { Accordion, AccordionItem, Collapsible } from './Accordion'
import { Callout } from './Callout'
import { Cards, Card } from './Cards'
import { Pre } from './CodeBlock'
import { FileTree, Folder, File } from './FileTree'
import {
  MarkdownHeading,
  MarkdownLink,
  MarkdownTable,
  postkitComponents,
} from './MDXElements'
import { PackageInstall, NpmToYarn } from './PackageInstall'
import { Steps, Step } from './Steps'
import { Tabs, Tab, TabList, TabTrigger, TabContent } from './Tabs'

// Postkit owns prose. Native Chakra Docs components retain the documentation
// interactions and the existing authoring aliases.
export const MDXComponents: MDXComponentsType = {
  ...postkitComponents,
  ...Object.fromEntries(
    Object.entries(postkitComponents)
      .filter(([name]) => /^[A-Z]/.test(name))
      .map(([name, component]) => [`Postkit${name}`, component]),
  ),
  wrapper: Fragment,
  h1: (props) => <MarkdownHeading as="h1" {...props} />,
  h2: (props) => <MarkdownHeading as="h2" {...props} />,
  h3: (props) => <MarkdownHeading as="h3" {...props} />,
  h4: (props) => <MarkdownHeading as="h4" {...props} />,
  h5: (props) => <MarkdownHeading as="h5" {...props} />,
  h6: (props) => <MarkdownHeading as="h6" {...props} />,
  a: MarkdownLink,
  table: MarkdownTable,
  pre: Pre,
  Accordion,
  AccordionItem,
  Callout,
  Collapsible,
  FileTree,
  Folder,
  File,
  Steps,
  Step,
  Tabs,
  Tab,
  TabList,
  TabTrigger,
  TabContent,
  Cards,
  Card,
  PackageInstall,
  NpmToYarn,
}
