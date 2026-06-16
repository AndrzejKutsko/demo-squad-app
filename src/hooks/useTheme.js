import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'calc_theme'

export function useTheme() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(THEME_KEY) || 'light'
  )

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme }
}
