import { createSignal } from 'solid-js'
import type { Theme, ThemeName } from '@/features/content/themes/types'
import { themes } from '@/features/content/themes/registry'

const THEME_STORAGE_KEY = 'decktype-theme'

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case: subAlt -> --sub-alt
    const property = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(property, value)
  })
}

const getInitialTheme = (): ThemeName => {
  if (typeof localStorage === 'undefined') return 'serika_dark'
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName
  if (saved && themes[saved]) {
    return saved
  }
  return 'serika_dark'
}

const [currentThemeName, setCurrentThemeName] = createSignal<ThemeName>(getInitialTheme())

export { currentThemeName }

export const themeManager = {
  get current() {
    return currentThemeName()
  },
  
  init() {
    applyTheme(themes[currentThemeName()])
  },

  select(name: ThemeName) {
    setCurrentThemeName(name)
    applyTheme(themes[name])
    localStorage.setItem(THEME_STORAGE_KEY, name)
  },

  preview(name: ThemeName) {
    applyTheme(themes[name])
  },

  reset() {
    applyTheme(themes[currentThemeName()])
  }
}
