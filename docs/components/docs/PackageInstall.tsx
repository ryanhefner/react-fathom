'use client'

import { Box, Flex, IconButton } from '@chakra-ui/react'
import { useState } from 'react'

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

interface PackageInstallProps {
  packages: string | string[]
  dev?: boolean
}

const commands: Record<PackageManager, { install: string; devFlag: string }> = {
  npm: { install: 'npm install', devFlag: '-D' },
  yarn: { install: 'yarn add', devFlag: '-D' },
  pnpm: { install: 'pnpm add', devFlag: '-D' },
  bun: { install: 'bun add', devFlag: '-d' },
}

export function PackageInstall({ packages, dev = false }: PackageInstallProps) {
  const [manager, setManager] = useState<PackageManager>('npm')
  const [copied, setCopied] = useState(false)

  const packageList = Array.isArray(packages) ? packages.join(' ') : packages
  const { install, devFlag } = commands[manager]
  const command = dev ? `${install} ${devFlag} ${packageList}` : `${install} ${packageList}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const managers: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun']

  return (
    <Box my={4} borderRadius="lg" overflow="hidden" bg="gray.900" _light={{ bg: 'gray.50' }}>
      {/* Tab header */}
      <Flex
        borderBottomWidth="1px"
        borderColor="gray.700"
        _light={{ borderColor: 'gray.200' }}
      >
        {managers.map((m) => (
          <Box
            key={m}
            as="button"
            px={4}
            py={2}
            fontSize="sm"
            fontWeight={manager === m ? 'semibold' : 'normal'}
            color={manager === m ? 'white' : 'gray.400'}
            bg={manager === m ? 'gray.800' : 'transparent'}
            _light={{
              color: manager === m ? 'gray.900' : 'gray.500',
              bg: manager === m ? 'gray.100' : 'transparent',
            }}
            borderBottomWidth="2px"
            borderBottomColor={manager === m ? 'blue.500' : 'transparent'}
            _hover={{ color: manager === m ? undefined : 'gray.200' }}
            onClick={() => setManager(m)}
          >
            {m}
          </Box>
        ))}
        <Box flex={1} />
        <IconButton
          aria-label="Copy command"
          size="xs"
          variant="ghost"
          color="gray.400"
          _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
          m={2}
          onClick={handleCopy}
        >
          {copied ? '✓' : '📋'}
        </IconButton>
      </Flex>

      {/* Command */}
      <Box
        as="pre"
        p={4}
        fontSize="sm"
        lineHeight="tall"
        overflowX="auto"
        color="gray.100"
        _light={{ color: 'gray.800' }}
        fontFamily="mono"
      >
        <code>{command}</code>
      </Box>
    </Box>
  )
}

// Simpler version that just transforms npm commands to other managers
interface NpmToYarnProps {
  children: string
}

export function NpmToYarn({ children }: NpmToYarnProps) {
  const [manager, setManager] = useState<PackageManager>('npm')
  const [copied, setCopied] = useState(false)

  // Transform npm command to other package managers
  const transformCommand = (cmd: string, to: PackageManager): string => {
    let result = cmd.trim()

    if (to === 'npm') return result

    // npm install -> yarn/pnpm add/bun add
    result = result.replace(/^npm install/, commands[to].install)
    result = result.replace(/^npm i /, `${commands[to].install} `)

    // npm run -> yarn/pnpm/bun (no run needed for yarn)
    if (to === 'yarn') {
      result = result.replace(/^npm run /, 'yarn ')
    } else {
      result = result.replace(/^npm run /, `${to} run `)
    }

    // npm init -> yarn init/pnpm init/bun init
    result = result.replace(/^npm init/, `${to} init`)

    // npm ci -> yarn install --frozen-lockfile/pnpm install --frozen-lockfile
    if (to === 'yarn') {
      result = result.replace(/^npm ci$/, 'yarn install --frozen-lockfile')
    } else if (to === 'pnpm') {
      result = result.replace(/^npm ci$/, 'pnpm install --frozen-lockfile')
    } else if (to === 'bun') {
      result = result.replace(/^npm ci$/, 'bun install --frozen-lockfile')
    }

    // -D flag
    result = result.replace(/ -D /, ` ${commands[to].devFlag} `)
    result = result.replace(/ --save-dev /, ` ${commands[to].devFlag} `)

    return result
  }

  const command = transformCommand(children, manager)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const managers: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun']

  return (
    <Box my={4} borderRadius="lg" overflow="hidden" bg="gray.900" _light={{ bg: 'gray.50' }}>
      <Flex
        borderBottomWidth="1px"
        borderColor="gray.700"
        _light={{ borderColor: 'gray.200' }}
      >
        {managers.map((m) => (
          <Box
            key={m}
            as="button"
            px={4}
            py={2}
            fontSize="sm"
            fontWeight={manager === m ? 'semibold' : 'normal'}
            color={manager === m ? 'white' : 'gray.400'}
            bg={manager === m ? 'gray.800' : 'transparent'}
            _light={{
              color: manager === m ? 'gray.900' : 'gray.500',
              bg: manager === m ? 'gray.100' : 'transparent',
            }}
            borderBottomWidth="2px"
            borderBottomColor={manager === m ? 'blue.500' : 'transparent'}
            _hover={{ color: manager === m ? undefined : 'gray.200' }}
            onClick={() => setManager(m)}
          >
            {m}
          </Box>
        ))}
        <Box flex={1} />
        <IconButton
          aria-label="Copy command"
          size="xs"
          variant="ghost"
          color="gray.400"
          _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
          m={2}
          onClick={handleCopy}
        >
          {copied ? '✓' : '📋'}
        </IconButton>
      </Flex>
      <Box
        as="pre"
        p={4}
        fontSize="sm"
        lineHeight="tall"
        overflowX="auto"
        color="gray.100"
        _light={{ color: 'gray.800' }}
        fontFamily="mono"
      >
        <code>{command}</code>
      </Box>
    </Box>
  )
}
