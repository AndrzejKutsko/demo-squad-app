import { render, screen } from '@testing-library/react'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const getButton = (label) => {
  return screen.getByRole('button', { name: label })
}

const getDisplay = () => {
  const display = screen.getByLabelText('Calculator display')
  return within(display)
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.className = ''
  })

  it('renders without crashing', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('shows 0 on initial load', () => {
    render(<App />)

    expect(getDisplay().getByText('0')).toBeInTheDocument()
  })

  it('updates the display when a digit button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getButton('5'))

    expect(getDisplay().getByText('5')).toBeInTheDocument()
  })

  it('evaluates a clicked calculation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getButton('5'))
    await user.click(getButton('+'))
    await user.click(getButton('3'))
    await user.click(getButton('='))

    expect(getDisplay().getByText('8')).toBeInTheDocument()
  })

  it('adds completed calculations to history', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getButton('5'))
    await user.click(getButton('+'))
    await user.click(getButton('3'))
    await user.click(getButton('='))

    expect(screen.getByText('5 + 3 = 8')).toBeInTheDocument()
  })

  it('renders the theme toggle button', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('toggles the body class when the theme toggle is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /toggle theme/i }))

    expect(document.body).toHaveClass('dark')
  })

  it('clears the history log', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getButton('5'))
    await user.click(getButton('+'))
    await user.click(getButton('3'))
    await user.click(getButton('='))
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByText('No calculations yet')).toBeInTheDocument()
  })

  it('accepts keyboard digit input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.keyboard('7')

    expect(getDisplay().getByText('7')).toBeInTheDocument()
  })

  it('evaluates keyboard Enter after an operation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getButton('5'))
    await user.click(getButton('+'))
    await user.click(getButton('3'))
    await user.keyboard('{Enter}')

    expect(getDisplay().getByText('8')).toBeInTheDocument()
  })

  it('clears the display when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getButton('9'))
    await user.keyboard('{Escape}')

    expect(getDisplay().getByText('0')).toBeInTheDocument()
  })
})
