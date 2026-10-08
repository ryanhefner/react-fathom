'use client'

import { CodeBlock, DocsTabs } from '@chakra-docs/chakra'

const managers = ['npm', 'yarn', 'pnpm', 'bun'] as const
type PackageManager = (typeof managers)[number]

const commands: Record<PackageManager, { install: string; devFlag: string }> = {
  npm: { install: 'npm install', devFlag: '-D' },
  yarn: { install: 'yarn add', devFlag: '-D' },
  pnpm: { install: 'pnpm add', devFlag: '-D' },
  bun: { install: 'bun add', devFlag: '-d' },
}

function PackageCommands({
  command,
}: {
  command: (manager: PackageManager) => string
}) {
  return (
    <DocsTabs.Root preference="package-manager">
      <DocsTabs.List>
        {managers.map((manager) => (
          <DocsTabs.Trigger key={manager} value={manager}>
            {manager}
          </DocsTabs.Trigger>
        ))}
      </DocsTabs.List>
      {managers.map((manager) => (
        <DocsTabs.Content key={manager} value={manager}>
          <CodeBlock
            code={command(manager)}
            language="bash"
            packageManager={manager}
          />
        </DocsTabs.Content>
      ))}
    </DocsTabs.Root>
  )
}

export function PackageInstall({
  packages,
  dev = false,
}: {
  packages: string | string[]
  dev?: boolean
}) {
  const packageList = Array.isArray(packages) ? packages.join(' ') : packages

  return (
    <PackageCommands
      command={(manager) => {
        const { install, devFlag } = commands[manager]
        return `${install}${dev ? ` ${devFlag}` : ''} ${packageList}`
      }}
    />
  )
}

export function NpmToYarn({ children }: { children: string }) {
  return (
    <PackageCommands
      command={(manager) => {
        let command = children.trim()
        if (manager === 'npm') return command

        command = command.replace(
          /^npm (?:install|i)(?=\s|$)/,
          commands[manager].install,
        )
        command = command.replace(
          /^npm run /,
          manager === 'yarn' ? 'yarn ' : `${manager} run `,
        )
        command = command.replace(/^npm init/, `${manager} init`)
        command = command.replace(
          /^npm ci$/,
          `${manager} install --frozen-lockfile`,
        )
        return command.replace(
          / (?:-D|--save-dev)(?=\s|$)/g,
          ` ${commands[manager].devFlag}`,
        )
      }}
    />
  )
}
