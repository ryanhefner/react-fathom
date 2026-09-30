import type { MDXComponents as MDXComponentsType } from 'mdx/types'

import { Accordion, AccordionItem, Collapsible } from './Accordion'
import { Callout } from './Callout'
import { Cards, Card } from './Cards'
import { Pre } from './CodeBlock'
import { FileTree, Folder, File } from './FileTree'
import {
  MarkdownElement,
  MarkdownHeading,
  MarkdownLink,
  MarkdownCode,
  MarkdownTable,
} from './MDXElements'
import { PackageInstall, NpmToYarn } from './PackageInstall'
import { Steps, Step } from './Steps'
import { Tabs, Tab, TabList, TabTrigger, TabContent } from './Tabs'

export function getMDXComponents(): MDXComponentsType {
  return MDXComponents
}

// MDX keeps its JSX compiler while sharing native Markdown recipe slots.
export const MDXComponents: MDXComponentsType = {
  h1: (props) => <MarkdownHeading as="h1" {...props} />,
  h2: (props) => <MarkdownHeading as="h2" {...props} />,
  h3: (props) => <MarkdownHeading as="h3" {...props} />,
  h4: (props) => <MarkdownHeading as="h4" {...props} />,
  h5: (props) => <MarkdownHeading as="h5" {...props} />,
  h6: (props) => <MarkdownHeading as="h6" {...props} />,
  p: (props) => <MarkdownElement as="p" slot="paragraph" {...props} />,
  a: MarkdownLink,
  ul: (props) => <MarkdownElement as="ul" slot="list" {...props} />,
  ol: (props) => <MarkdownElement as="ol" slot="list" {...props} />,
  li: (props) => <MarkdownElement as="li" slot="listItem" {...props} />,
  code: MarkdownCode,
  pre: Pre,
  table: MarkdownTable,
  thead: (props) => <MarkdownElement as="thead" slot="tableHead" {...props} />,
  tbody: (props) => <MarkdownElement as="tbody" slot="tableBody" {...props} />,
  tr: (props) => <MarkdownElement as="tr" slot="tableRow" {...props} />,
  th: (props) => <MarkdownElement as="th" slot="tableHeader" {...props} />,
  td: (props) => <MarkdownElement as="td" slot="tableCell" {...props} />,
  blockquote: (props) => <Callout title="Note">{props.children}</Callout>,
  hr: (props) => <MarkdownElement as="hr" slot="separator" {...props} />,
  img: (props) => <MarkdownElement as="img" slot="image" {...props} />,
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
