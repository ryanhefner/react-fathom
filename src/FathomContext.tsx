import { createContext } from 'react'

import type { FathomContextInterface } from './types'

export const FathomContext = createContext<Partial<FathomContextInterface>>({})
