import { act, renderHook } from '@testing-library/react'
import { useCalculator } from '../hooks/useCalculator'

const input = (result, value) => {
  act(() => {
    result.current.handleInput(value)
  })
}

const action = (result, value) => {
  act(() => {
    result.current.handleAction(value)
  })
}

describe('useCalculator', () => {
  describe('basic arithmetic', () => {
    it.each([
      ['1 + 2 = 3', ['1', '+', '2']],
      ['10 − 4 = 6', ['1', '0', '-', '4']],
      ['3 × 4 = 12', ['3', '*', '4']],
      ['10 ÷ 2 = 5', ['1', '0', '/', '2']]
    ])('evaluates %s', (historyEntry, sequence) => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      sequence.forEach((step) => {
        if (/^\d$/.test(step)) {
          input(result, step)
        } else {
          input(result, step)
        }
      })
      action(result, 'equals')

      expect(result.current.currentValue).toBe(historyEntry.split(' = ')[1])
      expect(onResult).toHaveBeenCalledWith(historyEntry)
    })

    it('handles one third as an approximate decimal', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '1')
      input(result, '/')
      input(result, '3')
      action(result, 'equals')

      expect(parseFloat(result.current.currentValue)).toBeCloseTo(1 / 3, 9)
      expect(result.current.currentValue).not.toBe('1/3')
      expect(onResult).toHaveBeenCalledTimes(1)
    })
  })

  describe('chaining', () => {
    it('evaluates chained operations left to right', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '1')
      input(result, '2')
      input(result, '+')
      input(result, '5')
      input(result, '*')

      expect(result.current.currentValue).toBe('17')
      expect(result.current.expression).toBe('17 ×')

      input(result, '2')
      action(result, 'equals')

      expect(result.current.currentValue).toBe('34')
      expect(onResult).toHaveBeenCalledWith(expect.stringContaining('34'))
    })

    it('keeps the left operand visible after pressing an operator', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '8')
      input(result, '+')

      expect(result.current.currentValue).toBe('8')
      expect(result.current.expression).toBe('8 +')
      expect(onResult).not.toHaveBeenCalled()
    })

    it('updates the pending operator when pressed twice', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '8')
      input(result, '+')
      input(result, '-')

      expect(result.current.currentValue).toBe('8')
      expect(result.current.expression).toBe('8 −')
      expect(onResult).not.toHaveBeenCalled()
    })
  })

  describe('equals edge cases', () => {
    it('does nothing when equals is pressed without an operator', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '7')
      action(result, 'equals')

      expect(result.current.currentValue).toBe('7')
      expect(result.current.expression).toBe('')
      expect(onResult).not.toHaveBeenCalled()
    })

    it('does nothing when equals is pressed while waiting for an operand', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '7')
      input(result, '+')
      action(result, 'equals')

      expect(result.current.currentValue).toBe('7')
      expect(result.current.expression).toBe('7 +')
      expect(onResult).not.toHaveBeenCalled()
    })

    it('starts fresh when a digit is pressed after equals', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '8')
      input(result, '-')
      input(result, '3')
      action(result, 'equals')
      input(result, '7')

      expect(result.current.currentValue).toBe('7')
      expect(result.current.expression).toBe('')
    })

    it('continues from the result when an operator is pressed after equals', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '8')
      input(result, '-')
      input(result, '3')
      action(result, 'equals')
      input(result, '+')
      input(result, '2')
      action(result, 'equals')

      expect(result.current.currentValue).toBe('7')
      expect(onResult).toHaveBeenLastCalledWith('5 + 2 = 7')
    })
  })

  describe('clear', () => {
    it('resets the calculator display state', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '1')
      input(result, '+')
      input(result, '2')
      action(result, 'clear')

      expect(result.current.currentValue).toBe('0')
      expect(result.current.expression).toBe('')
    })
  })

  describe('backspace', () => {
    it('removes the last digit', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '1')
      input(result, '2')
      input(result, '3')
      action(result, 'backspace')

      expect(result.current.currentValue).toBe('12')
    })

    it('returns to zero when removing the only digit', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '8')
      action(result, 'backspace')

      expect(result.current.currentValue).toBe('0')
    })

    it('ignores backspace after equals', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '3')
      input(result, '+')
      input(result, '4')
      action(result, 'equals')
      action(result, 'backspace')

      expect(result.current.currentValue).toBe('7')
    })

    it('ignores backspace while waiting for the next operand', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '9')
      input(result, '+')
      action(result, 'backspace')

      expect(result.current.currentValue).toBe('9')
      expect(result.current.expression).toBe('9 +')
    })
  })

  describe('decimal', () => {
    it('appends a decimal to an integer', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '1')
      action(result, 'decimal')

      expect(result.current.currentValue).toBe('1.')
    })

    it('ignores a second decimal in the same number', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '1')
      action(result, 'decimal')
      input(result, '5')
      action(result, 'decimal')

      expect(result.current.currentValue).toBe('1.5')
    })

    it('starts a new operand as 0. after an operator', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      input(result, '+')
      action(result, 'decimal')

      expect(result.current.currentValue).toBe('0.')
    })

    it('turns zero into 0. when decimal is pressed', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      action(result, 'decimal')

      expect(result.current.currentValue).toBe('0.')
    })
  })

  describe('negate', () => {
    it('toggles a positive number to negative', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      action(result, 'negate')

      expect(result.current.currentValue).toBe('-5')
    })

    it('toggles a negative number back to positive', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      action(result, 'negate')
      action(result, 'negate')

      expect(result.current.currentValue).toBe('5')
    })

    it('does not negate zero', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      action(result, 'negate')

      expect(result.current.currentValue).toBe('0')
    })
  })

  describe('division by zero', () => {
    it('shows Error when dividing by zero', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      input(result, '/')
      input(result, '0')
      action(result, 'equals')

      expect(result.current.currentValue).toBe('Error')
    })

    it('does not publish an error result to history', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      input(result, '/')
      input(result, '0')
      action(result, 'equals')

      expect(onResult).not.toHaveBeenCalled()
    })

    it('recovers to zero after clear', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      input(result, '/')
      input(result, '0')
      action(result, 'equals')
      action(result, 'clear')

      expect(result.current.currentValue).toBe('0')
      expect(result.current.expression).toBe('')
    })

    it('starts fresh when a digit is pressed after Error', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      input(result, '5')
      input(result, '/')
      input(result, '0')
      action(result, 'equals')
      input(result, '7')

      expect(result.current.currentValue).toBe('7')
      expect(result.current.expression).toBe('')
    })
  })

  describe('large numbers', () => {
    it('ignores a sixteenth digit', () => {
      const onResult = vi.fn()
      const { result } = renderHook(() => useCalculator(onResult))

      '1234567890123456'.split('').forEach((digit) => {
        input(result, digit)
      })

      expect(result.current.currentValue).toBe('123456789012345')
    })
  })
})
