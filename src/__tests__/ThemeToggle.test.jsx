import { fireEvent, render, screen } from '@testing-library/react'
import ThemeToggle from '../components/ThemeToggle'

describe('ThemeToggle', () => {
  it('shows the moon icon for light theme', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />)

    expect(screen.getByText('🌙')).toBeInTheDocument()
  })

  it('shows the sun icon for dark theme', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />)

    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<ThemeToggle theme="light" onToggle={onToggle} />)

    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('has an accessible toggle theme label', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument()
  })
})
