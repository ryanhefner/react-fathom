import { useContext } from 'react'

import { FathomContext } from '../FathomContext.js'
import type { FathomContextInterface } from '../types.js'

export const useFathom = (): FathomContextInterface => {
  const context = useContext(FathomContext)
  return context
}

useFathom.displayName = 'useFathom'
