import { act, renderHook } from '@testing-library/react'
import { useTheme } from '../hooks/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.className = ''
  })

  it('defaults to the light theme', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('toggles from light to dark', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
  })

  it('toggles back to light on the second click', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
  })

  it('adds the dark class to the body for dark theme', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(document.body).toHaveClass('dark')
  })

  it('removes the dark class when toggled back to light', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
      result.current.toggleTheme()
    })

    expect(document.body).not.toHaveClass('dark')
  })

  it('persists the selected theme to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(localStorage.getItem('calc_theme')).toBe('dark')
  })

  it('initializes from a persisted dark theme', () => {
    localStorage.setItem('calc_theme', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.body).toHaveClass('dark')
  })
})
