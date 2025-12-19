import { useContext } from 'react'

import { FathomContext } from '../FathomContext'
import type { FathomContextInterface } from '../types'

export const useFathom = (): FathomContextInterface => {
  const context = useContext(FathomContext)
  return context
}

useFathom.displayName = 'useFathom'
