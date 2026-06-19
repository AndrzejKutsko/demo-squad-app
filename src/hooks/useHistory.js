import { useCallback, useState } from 'react'

const HISTORY_KEY = 'calc_history'
const MAX_HISTORY = 50

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (!saved) {
        return []
      }

      const parsed = JSON.parse(saved)
      return Array.isArray(parsed)
        ? parsed.filter((entry) => typeof entry === 'string').slice(0, MAX_HISTORY)
        : []
    } catch {
      return []
    }
  })

  const addToHistory = useCallback((entry) => {
    setHistory((previousHistory) => {
      const nextHistory = [entry, ...previousHistory].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
      return nextHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  return { history, addToHistory, clearHistory }
}
