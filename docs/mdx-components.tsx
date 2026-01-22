import { useMDXComponents as getThemeMDXComponents } from 'nextra-theme-docs'

const themeComponents = getThemeMDXComponents()

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...themeComponents,
    ...components,
  }
}
