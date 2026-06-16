import { fireEvent, render, screen } from '@testing-library/react'
import HistoryLog from '../components/HistoryLog'

describe('HistoryLog', () => {
  it('shows the empty state when there is no history', () => {
    render(<HistoryLog history={[]} onClear={vi.fn()} />)

    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
  })

  it('renders a single history entry', () => {
    render(<HistoryLog history={['1 + 1 = 2']} onClear={vi.fn()} />)

    expect(screen.getByText('1 + 1 = 2')).toBeInTheDocument()
  })

  it('renders multiple history entries', () => {
    render(<HistoryLog history={['3 + 3 = 6', '2 + 2 = 4']} onClear={vi.fn()} />)

    expect(screen.getByText('3 + 3 = 6')).toBeInTheDocument()
    expect(screen.getByText('2 + 2 = 4')).toBeInTheDocument()
  })

  it('renders entries in the provided order', () => {
    render(<HistoryLog history={['latest', 'older', 'oldest']} onClear={vi.fn()} />)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'latest',
      'older',
      'oldest'
    ])
  })

  it('calls onClear when the clear button is clicked', () => {
    const onClear = vi.fn()
    render(<HistoryLog history={['1 + 1 = 2']} onClear={onClear} />)

    fireEvent.click(screen.getByRole('button', { name: /clear/i }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('shows the clear button even when history is empty', () => {
    render(<HistoryLog history={[]} onClear={vi.fn()} />)

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })
})
