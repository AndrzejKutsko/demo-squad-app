import { fireEvent, render, screen } from '@testing-library/react'
import ButtonGrid from '../components/ButtonGrid'

const getButton = (matcher) =>
  screen.getAllByRole('button').find((button) => matcher.test(button.getAttribute('aria-label') || ''))

describe('ButtonGrid', () => {
  describe('button clicks', () => {
    it('renders all 19 buttons', () => {
      render(<ButtonGrid onInput={vi.fn()} onAction={vi.fn()} />)

      expect(screen.getAllByRole('button')).toHaveLength(19)
    })

    it('routes AC to clear', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.click(getButton(/AC/))

      expect(onAction).toHaveBeenCalledWith('clear')
    })

    it('routes backspace to backspace action', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.click(getButton(/⌫/))

      expect(onAction).toHaveBeenCalledWith('backspace')
    })

    it('routes negate to negate action', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.click(getButton(/\+\/−/))

      expect(onAction).toHaveBeenCalledWith('negate')
    })

    it('routes digit buttons to onInput', () => {
      const onInput = vi.fn()
      render(<ButtonGrid onInput={onInput} onAction={vi.fn()} />)

      fireEvent.click(getButton(/7/))

      expect(onInput).toHaveBeenCalledWith('7')
    })

    it('routes operators to onInput', () => {
      const onInput = vi.fn()
      render(<ButtonGrid onInput={onInput} onAction={vi.fn()} />)

      fireEvent.click(getButton(/^\+$/))

      expect(onInput).toHaveBeenCalledWith('+')
    })

    it('routes equals to equals action', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.click(getButton(/=/))

      expect(onAction).toHaveBeenCalledWith('equals')
    })

    it('routes decimal to decimal action', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.click(getButton(/\./))

      expect(onAction).toHaveBeenCalledWith('decimal')
    })
  })

  describe('keyboard support', () => {
    it('handles number keys', () => {
      const onInput = vi.fn()
      render(<ButtonGrid onInput={onInput} onAction={vi.fn()} />)

      fireEvent.keyDown(document, { key: '7' })

      expect(onInput).toHaveBeenCalledWith('7')
    })

    it('handles operator keys', () => {
      const onInput = vi.fn()
      render(<ButtonGrid onInput={onInput} onAction={vi.fn()} />)

      fireEvent.keyDown(document, { key: '+' })

      expect(onInput).toHaveBeenCalledWith('+')
    })

    it('handles Enter as equals', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.keyDown(document, { key: 'Enter' })

      expect(onAction).toHaveBeenCalledWith('equals')
    })

    it('handles Backspace as backspace', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.keyDown(document, { key: 'Backspace' })

      expect(onAction).toHaveBeenCalledWith('backspace')
    })

    it('handles Escape as clear', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onAction).toHaveBeenCalledWith('clear')
    })

    it('handles period as decimal', () => {
      const onAction = vi.fn()
      render(<ButtonGrid onInput={vi.fn()} onAction={onAction} />)

      fireEvent.keyDown(document, { key: '.' })

      expect(onAction).toHaveBeenCalledWith('decimal')
    })

    it('ignores unhandled keys', () => {
      const onInput = vi.fn()
      const onAction = vi.fn()
      render(<ButtonGrid onInput={onInput} onAction={onAction} />)

      fireEvent.keyDown(document, { key: 'a' })

      expect(onInput).not.toHaveBeenCalled()
      expect(onAction).not.toHaveBeenCalled()
    })

    it('prevents default browser behavior for every intercepted key', () => {
      render(<ButtonGrid onInput={vi.fn()} onAction={vi.fn()} />)

      ;['7', '+', 'Enter', 'Backspace', 'Escape', '.', '0', '/'].forEach((key) => {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })

        document.dispatchEvent(event)

        expect(event.defaultPrevented).toBe(true)
      })
    })
  })
})
