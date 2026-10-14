import { Graph } from 'react-structured'

import { SITE_URL } from '../../lib/site-metadata'
import {
  createPageGraph,
  type StructuredPage,
  type StructuredPageOptions,
} from '../../lib/structured-data'

export function StructuredData({
  page,
  ...options
}: StructuredPageOptions & { page: StructuredPage }) {
  return (
    <Graph
      id="page-structured-data"
      data={createPageGraph(page, options, SITE_URL)}
    />
  )
}
