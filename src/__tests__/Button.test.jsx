import { fireEvent, render, screen } from '@testing-library/react'
import Button from '../components/Button'

const getButtonElement = (matcher) =>
  screen.getAllByRole('button').find((button) => matcher.test(button.textContent || ''))

describe('Button', () => {
  it('renders the label text', () => {
    render(<Button label="7" onClick={vi.fn()} />)

    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('renders the key hint text', () => {
    render(<Button label="AC" keyHint="Esc" onClick={vi.fn()} />)

    expect(screen.getByText('Esc')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button label="7" onClick={onClick} />)

    fireEvent.click(getButtonElement(/^7$/))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick only once per click', () => {
    const onClick = vi.fn()
    render(<Button label="7" onClick={onClick} />)

    fireEvent.click(getButtonElement(/^7$/))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders with the wide prop', () => {
    render(<Button label="0" wide onClick={vi.fn()} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it.each(['number', 'operator', 'action', 'equals'])('renders the %s variant', (variant) => {
    render(<Button label={variant} variant={variant} onClick={vi.fn()} />)

    expect(screen.getByText(variant)).toBeInTheDocument()
  })
})
