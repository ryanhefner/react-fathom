import pluginImport from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import pluginJs from '@eslint/js'

export default [
  // Ignore patterns
  {
    ignores: ['dist/**'],
  },

  // Base JavaScript recommended config
  pluginJs.configs.recommended,

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: true,
      },
    },
  },

  // TypeScript ESLint recommended configs
  ...tseslint.configs.recommended,

  // React plugin configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': reactHooks,
      import: pluginImport,
    },
    rules: {
      ...(pluginReact.configs?.recommended?.rules || {}),
      ...(reactHooks.configs?.recommended?.rules || {}),
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Import ordering rules: react -> namespaced external (@package) -> non-namespaced external -> internal -> local
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // External libraries (non-namespaced)
            'internal', // Internal absolute imports
            ['parent', 'sibling', 'index'], // Relative imports (local)
          ],
          pathGroups: [
            // React imports first
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react/**',
              group: 'external',
              position: 'before',
            },
            // Namespaced external imports (@package/name) - after React, before non-namespaced externals
            // Create a separate group for namespaced imports to ensure they come before non-namespaced
            {
              pattern: '@*/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          // Alphabetize imports within each group
          // Note: For external group, pathGroups ordering takes precedence:
          // React -> namespaced (@package) -> non-namespaced
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },

  // Prettier integration (must be last)
  prettier,

  // Custom rules
  {
    rules: {
      semi: ['error', 'never'],
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
]
