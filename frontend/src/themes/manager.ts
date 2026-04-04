import type { Theme } from './types'

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case: subAlt -> --sub-alt
    const property = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(property, value)
  })
}
