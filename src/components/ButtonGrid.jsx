import { useEffect } from 'react'
import Button from './Button.jsx'
import styles from './ButtonGrid.module.css'

const BUTTONS = [
  { label: 'AC', keyHint: 'Esc', variant: 'action', action: 'clear' },
  { label: '⌫', keyHint: '⌫', variant: 'action', action: 'backspace' },
  { label: '+/−', keyHint: '±', variant: 'action', action: 'negate' },
  { label: '÷', keyHint: '/', variant: 'operator', value: '/' },
  { label: '7', keyHint: '7', variant: 'number', value: '7' },
  { label: '8', keyHint: '8', variant: 'number', value: '8' },
  { label: '9', keyHint: '9', variant: 'number', value: '9' },
  { label: '×', keyHint: '*', variant: 'operator', value: '*' },
  { label: '4', keyHint: '4', variant: 'number', value: '4' },
  { label: '5', keyHint: '5', variant: 'number', value: '5' },
  { label: '6', keyHint: '6', variant: 'number', value: '6' },
  { label: '−', keyHint: '-', variant: 'operator', value: '-' },
  { label: '1', keyHint: '1', variant: 'number', value: '1' },
  { label: '2', keyHint: '2', variant: 'number', value: '2' },
  { label: '3', keyHint: '3', variant: 'number', value: '3' },
  { label: '+', keyHint: '+', variant: 'operator', value: '+' },
  { label: '0', keyHint: '0', variant: 'number', value: '0', wide: true },
  { label: '.', keyHint: '.', variant: 'number', action: 'decimal' },
  { label: '=', keyHint: 'Enter', variant: 'equals', action: 'equals' },
]

export default function ButtonGrid({ onInput, onAction }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        onInput(e.key)
        return
      }

      if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault()
        onInput(e.key)
        return
      }

      if (e.key === '.') {
        e.preventDefault()
        onAction('decimal')
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        onAction('equals')
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        onAction('backspace')
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        onAction('clear')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onInput, onAction])

  return (
    <section className={styles.grid} aria-label="Calculator keypad">
      {BUTTONS.map((btn, i) => (
        <Button
          key={i}
          label={btn.label}
          keyHint={btn.keyHint}
          variant={btn.variant}
          wide={btn.wide}
          onClick={() => (btn.action ? onAction(btn.action) : onInput(btn.value))}
        />
      ))}
    </section>
  )
}
