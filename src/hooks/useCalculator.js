import { useCallback, useReducer } from 'react'

const OP_SYMBOLS = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷'
}

const MAX_DIGITS = 15

const initialState = {
  currentValue: '0',
  previousValue: '',
  operator: null,
  waitingForOperand: false,
  justEvaluated: false,
  expression: ''
}

function countDigits(value) {
  return value.replace('-', '').replace('.', '').length
}

function formatResult(result) {
  if (result === 'Error' || !Number.isFinite(result)) {
    return 'Error'
  }

  const normalized = parseFloat(result.toPrecision(10))

  if (!Number.isFinite(normalized)) {
    return 'Error'
  }

  let formatted = normalized.toString()

  if (formatted.length <= MAX_DIGITS) {
    return formatted
  }

  for (let precision = 8; precision >= 1; precision -= 1) {
    formatted = normalized.toExponential(precision).replace(/\.?0+e/, 'e')
    if (formatted.length <= MAX_DIGITS) {
      return formatted
    }
  }

  return normalized.toExponential(1)
}

function calculate(a, b, op) {
  const numA = parseFloat(a)
  const numB = parseFloat(b)

  switch (op) {
    case '+':
      return numA + numB
    case '-':
      return numA - numB
    case '*':
      return numA * numB
    case '/':
      if (numB === 0) {
        return 'Error'
      }
      return numA / numB
    default:
      return numB
  }
}

function calculatorReducer(state, action) {
  switch (action.type) {
    case 'DIGIT':
      if (state.currentValue === 'Error') {
        return {
          ...initialState,
          currentValue: action.payload
        }
      }

      if (state.waitingForOperand || state.justEvaluated) {
        return {
          ...state,
          currentValue: action.payload,
          waitingForOperand: false,
          justEvaluated: false,
          expression: state.justEvaluated ? '' : state.expression
        }
      }

      if (countDigits(state.currentValue) >= MAX_DIGITS) {
        return state
      }

      return {
        ...state,
        currentValue: state.currentValue === '0'
          ? action.payload
          : state.currentValue + action.payload
      }

    case 'DECIMAL':
      if (state.currentValue === 'Error') {
        return {
          ...initialState,
          currentValue: '0.'
        }
      }

      if (state.waitingForOperand || state.justEvaluated) {
        return {
          ...state,
          currentValue: '0.',
          waitingForOperand: false,
          justEvaluated: false,
          expression: state.justEvaluated ? '' : state.expression
        }
      }

      if (state.currentValue.includes('.')) {
        return state
      }

      return {
        ...state,
        currentValue: state.currentValue + '.'
      }

    case 'OPERATOR': {
      const nextOperator = action.payload

      if (state.currentValue === 'Error') {
        return state
      }

      if (state.operator && state.waitingForOperand) {
        return {
          ...state,
          operator: nextOperator,
          justEvaluated: false,
          expression: `${state.previousValue} ${OP_SYMBOLS[nextOperator]}`
        }
      }

      if (state.operator && !state.waitingForOperand) {
        const leftOperand = state.previousValue
        const rightOperand = state.currentValue
        const expressionText = `${leftOperand} ${OP_SYMBOLS[state.operator]} ${rightOperand} =`
        const chainedResult = calculate(leftOperand, rightOperand, state.operator)
        const formattedResult = formatResult(chainedResult)

        if (formattedResult === 'Error') {
          return {
            ...initialState,
            currentValue: 'Error',
            justEvaluated: true,
            expression: expressionText
          }
        }

        return {
          ...state,
          currentValue: formattedResult,
          previousValue: formattedResult,
          operator: nextOperator,
          waitingForOperand: true,
          justEvaluated: false,
          expression: `${formattedResult} ${OP_SYMBOLS[nextOperator]}`
        }
      }

      return {
        ...state,
        previousValue: state.currentValue,
        operator: nextOperator,
        waitingForOperand: true,
        justEvaluated: false,
        expression: `${state.currentValue} ${OP_SYMBOLS[nextOperator]}`
      }
    }

    case 'EQUALS':
      return {
        ...initialState,
        currentValue: action.payload.currentValue,
        justEvaluated: true,
        expression: action.payload.expression
      }

    case 'CLEAR':
      return initialState

    case 'BACKSPACE': {
      if (state.currentValue === 'Error' || state.justEvaluated || state.waitingForOperand) {
        return state
      }

      const nextValue = state.currentValue.slice(0, -1)

      return {
        ...state,
        currentValue: nextValue === '' || nextValue === '-' ? '0' : nextValue
      }
    }

    case 'NEGATE':
      if (state.currentValue === 'Error' || state.currentValue === '0' || state.currentValue === '') {
        return state
      }

      return {
        ...state,
        currentValue: state.currentValue.startsWith('-')
          ? state.currentValue.slice(1)
          : `-${state.currentValue}`,
        expression: state.justEvaluated ? '' : state.expression,
        justEvaluated: false
      }

    default:
      return state
  }
}

export function useCalculator(onResult) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  const handleEquals = useCallback(() => {
    if (!state.operator || state.waitingForOperand) {
      return
    }

    const leftOperand = state.previousValue
    const rightOperand = state.currentValue
    const expressionText = `${leftOperand} ${OP_SYMBOLS[state.operator]} ${rightOperand} =`
    const rawResult = calculate(leftOperand, rightOperand, state.operator)
    const formattedResult = formatResult(rawResult)

    if (formattedResult !== 'Error' && typeof onResult === 'function') {
      onResult(`${expressionText} ${formattedResult}`)
    }

    dispatch({
      type: 'EQUALS',
      payload: {
        currentValue: formattedResult,
        expression: expressionText
      }
    })
  }, [onResult, state])

  const handleInput = useCallback((value) => {
    if (/^\d$/.test(value)) {
      dispatch({ type: 'DIGIT', payload: value })
      return
    }

    if (Object.prototype.hasOwnProperty.call(OP_SYMBOLS, value)) {
      dispatch({ type: 'OPERATOR', payload: value })
    }
  }, [])

  const handleAction = useCallback((action) => {
    switch (action) {
      case 'clear':
        dispatch({ type: 'CLEAR' })
        break
      case 'backspace':
        dispatch({ type: 'BACKSPACE' })
        break
      case 'equals':
        handleEquals()
        break
      case 'decimal':
        dispatch({ type: 'DECIMAL' })
        break
      case 'negate':
        dispatch({ type: 'NEGATE' })
        break
      default:
        break
    }
  }, [handleEquals])

  return {
    currentValue: state.currentValue,
    expression: state.expression,
    handleInput,
    handleAction
  }
}
