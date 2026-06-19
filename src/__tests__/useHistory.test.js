import { act, renderHook } from '@testing-library/react'
import { useHistory } from '../hooks/useHistory'

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with an empty history array', () => {
    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual([])
  })

  it('adds a single history entry', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('1 + 1 = 2')
    })

    expect(result.current.history).toEqual(['1 + 1 = 2'])
  })

  it('prepends newer history entries first', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('1 + 1 = 2')
      result.current.addToHistory('2 + 2 = 4')
      result.current.addToHistory('3 + 3 = 6')
    })

    expect(result.current.history).toEqual(['3 + 3 = 6', '2 + 2 = 4', '1 + 1 = 2'])
  })

  it('keeps only the newest 50 entries', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      Array.from({ length: 51 }, (_, index) => index + 1).forEach((value) => {
        result.current.addToHistory(`${value} + ${value} = ${value * 2}`)
      })
    })

    expect(result.current.history).toHaveLength(50)
    expect(result.current.history[0]).toBe('51 + 51 = 102')
    expect(result.current.history[49]).toBe('2 + 2 = 4')
  })

  it('clears history state and persistence', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.addToHistory('1 + 1 = 2')
      result.current.clearHistory()
    })

    expect(result.current.history).toEqual([])
    expect([null, '[]']).toContain(localStorage.getItem('calc_history'))
  })

  it('reloads persisted history on a new render', () => {
    const firstRender = renderHook(() => useHistory())

    act(() => {
      firstRender.result.current.addToHistory('1 + 1 = 2')
    })
    firstRender.unmount()

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual(['1 + 1 = 2'])
  })

  it('falls back to an empty history when localStorage is malformed', () => {
    localStorage.setItem('calc_history', '{bad json')

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual([])
  })
})
