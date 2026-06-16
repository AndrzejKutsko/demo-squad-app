import { render, screen } from '@testing-library/react'
import Display from '../components/Display'

describe('Display', () => {
  it('renders the current value prominently', () => {
    render(<Display expression="" currentValue="123" />)

    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('renders the expression text', () => {
    render(<Display expression="12 + 5 =" currentValue="17" />)

    expect(screen.getByText('12 + 5 =')).toBeInTheDocument()
  })

  it('shows zero when currentValue is empty', () => {
    render(<Display expression="" currentValue="" />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders long numbers without crashing', () => {
    render(<Display expression="" currentValue="123456789012345" />)

    expect(screen.getByText('123456789012345')).toBeInTheDocument()
  })

  it('supports an empty expression', () => {
    render(<Display expression="" currentValue="42" />)

    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
