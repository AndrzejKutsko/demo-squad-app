const OP_SYMBOLS = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷'
};

const HISTORY_KEY = 'calc_history';
const THEME_KEY = 'calc_theme';
const MAX_DIGITS = 15;

const state = {
  currentValue: '0',
  previousValue: '',
  operator: null,
  waitingForOperand: false,
  justEvaluated: false
};

let history = [];

const elements = {
  expression: null,
  display: null,
  historyList: null,
  historySection: null,
  themeToggle: null,
  clearHistory: null,
  buttons: null
};

function cacheElements() {
  elements.expression = document.getElementById('expression');
  elements.display = document.getElementById('display');
  elements.historyList = document.getElementById('history-list');
  elements.historySection = document.getElementById('history-section');
  elements.themeToggle = document.getElementById('theme-toggle');
  elements.clearHistory = document.getElementById('clear-history');
  elements.buttons = document.querySelector('.button-grid');
}

function resetState() {
  state.currentValue = '0';
  state.previousValue = '';
  state.operator = null;
  state.waitingForOperand = false;
  state.justEvaluated = false;
}

function updateDisplay() {
  if (elements.display) {
    elements.display.textContent = state.currentValue || '0';
  }
}

function updateExpression(text) {
  if (elements.expression) {
    elements.expression.textContent = text || '';
  }
}

function countDigits(value) {
  return value.replace('-', '').replace('.', '').length;
}

function formatResult(result) {
  if (result === 'Error' || !Number.isFinite(result)) {
    return 'Error';
  }

  const normalized = parseFloat(result.toPrecision(10));

  if (!Number.isFinite(normalized)) {
    return 'Error';
  }

  let formatted = normalized.toString();

  if (formatted.length <= 15) {
    return formatted;
  }

  for (let precision = 8; precision >= 1; precision -= 1) {
    formatted = normalized.toExponential(precision).replace(/\.?0+e/, 'e');
    if (formatted.length <= 15) {
      return formatted;
    }
  }

  return normalized.toExponential(1);
}

function calculate(a, b, op) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  switch (op) {
    case '+':
      return numA + numB;
    case '-':
      return numA - numB;
    case '*':
      return numA * numB;
    case '/':
      if (numB === 0) {
        return 'Error';
      }
      return numA / numB;
    default:
      return numB;
  }
}

function setErrorState(expressionText) {
  state.currentValue = 'Error';
  state.previousValue = '';
  state.operator = null;
  state.waitingForOperand = false;
  state.justEvaluated = true;
  updateExpression(expressionText || '');
  updateDisplay();
}

function beginFreshEntry(nextValue) {
  state.currentValue = nextValue;
  state.previousValue = '';
  state.operator = null;
  state.waitingForOperand = false;
  state.justEvaluated = false;
  updateExpression('');
}

function handleDigit(digit) {
  if (state.currentValue === 'Error') {
    beginFreshEntry(digit);
    updateDisplay();
    return;
  }

  if (state.waitingForOperand || state.justEvaluated) {
    if (state.justEvaluated) {
      updateExpression('');
      state.justEvaluated = false;
    }

    state.currentValue = digit;
    state.waitingForOperand = false;
    updateDisplay();
    return;
  }

  if (countDigits(state.currentValue) >= MAX_DIGITS) {
    return;
  }

  state.currentValue = state.currentValue === '0' ? digit : state.currentValue + digit;
  updateDisplay();
}

function handleDecimal() {
  if (state.currentValue === 'Error') {
    beginFreshEntry('0.');
    updateDisplay();
    return;
  }

  if (state.waitingForOperand || state.justEvaluated) {
    if (state.justEvaluated) {
      updateExpression('');
      state.justEvaluated = false;
    }

    state.currentValue = '0.';
    state.waitingForOperand = false;
    updateDisplay();
    return;
  }

  if (state.currentValue.includes('.')) {
    return;
  }

  state.currentValue += '.';
  updateDisplay();
}

function handleOperator(nextOperator) {
  if (state.currentValue === 'Error') {
    return;
  }

  if (state.operator && state.waitingForOperand) {
    state.operator = nextOperator;
    state.justEvaluated = false;
    updateExpression(state.previousValue + ' ' + OP_SYMBOLS[nextOperator]);
    updateDisplay();
    return;
  }

  if (state.operator && !state.waitingForOperand) {
    const leftOperand = state.previousValue;
    const rightOperand = state.currentValue;
    const expressionText = leftOperand + ' ' + OP_SYMBOLS[state.operator] + ' ' + rightOperand + ' =';
    const chainedResult = calculate(leftOperand, rightOperand, state.operator);
    const formattedResult = formatResult(chainedResult);

    if (formattedResult === 'Error') {
      setErrorState(expressionText);
      return;
    }

    state.currentValue = formattedResult;
    state.previousValue = formattedResult;
  } else {
    state.previousValue = state.currentValue;
  }

  state.operator = nextOperator;
  state.waitingForOperand = true;
  state.justEvaluated = false;
  updateExpression(state.previousValue + ' ' + OP_SYMBOLS[nextOperator]);
  updateDisplay();
}

function addToHistory(entry) {
  history.unshift(entry);

  if (history.length > 50) {
    history.pop();
  }

  saveHistory();
  renderHistory();
}

function renderHistory() {
  if (!elements.historyList) {
    return;
  }

  elements.historyList.innerHTML = '';

  if (history.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'No calculations yet';
    elements.historyList.appendChild(emptyItem);

    if (elements.historySection) {
      elements.historySection.classList.add('is-empty');
    }

    return;
  }

  if (elements.historySection) {
    elements.historySection.classList.remove('is-empty');
  }

  history.forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
    elements.historyList.appendChild(item);
  });
}

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function loadHistory() {
  const saved = localStorage.getItem(HISTORY_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      history = Array.isArray(parsed)
        ? parsed.filter((entry) => typeof entry === 'string').slice(0, 50)
        : [];
    } catch {
      history = [];
    }
  } else {
    history = [];
  }

  renderHistory();
}

function clearHistory() {
  history = [];
  saveHistory();
  renderHistory();
}

function handleEquals() {
  if (!state.operator || state.waitingForOperand) {
    return;
  }

  const leftOperand = state.previousValue;
  const rightOperand = state.currentValue;
  const expressionText = leftOperand + ' ' + OP_SYMBOLS[state.operator] + ' ' + rightOperand + ' =';
  const rawResult = calculate(leftOperand, rightOperand, state.operator);
  const formattedResult = formatResult(rawResult);

  if (formattedResult === 'Error') {
    setErrorState(expressionText);
    return;
  }

  addToHistory(expressionText + ' ' + formattedResult);

  state.currentValue = formattedResult;
  state.previousValue = '';
  state.operator = null;
  state.waitingForOperand = false;
  state.justEvaluated = true;

  updateExpression(expressionText);
  updateDisplay();
}

function handleBackspace() {
  if (state.currentValue === 'Error' || state.justEvaluated || state.waitingForOperand) {
    return;
  }

  state.currentValue = state.currentValue.slice(0, -1);

  if (state.currentValue === '' || state.currentValue === '-') {
    state.currentValue = '0';
  }

  updateDisplay();
}

function handleNegate() {
  if (state.currentValue === 'Error' || state.currentValue === '0' || state.currentValue === '') {
    return;
  }

  if (state.justEvaluated) {
    updateExpression('');
    state.justEvaluated = false;
  }

  state.currentValue = state.currentValue.startsWith('-')
    ? state.currentValue.slice(1)
    : '-' + state.currentValue;

  updateDisplay();
}

function clearAll() {
  resetState();
  updateExpression('');
  updateDisplay();
}

function handleInput(value) {
  if (/^\d$/.test(value)) {
    handleDigit(value);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(OP_SYMBOLS, value)) {
    handleOperator(value);
  }
}

function handleAction(action) {
  switch (action) {
    case 'clear':
      clearAll();
      break;
    case 'backspace':
      handleBackspace();
      break;
    case 'equals':
      handleEquals();
      break;
    case 'decimal':
      handleDecimal();
      break;
    case 'negate':
      handleNegate();
      break;
    default:
      break;
  }
}

function applyTheme(theme) {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.toggle('dark', nextTheme === 'dark');

  if (elements.themeToggle) {
    elements.themeToggle.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
  }

  localStorage.setItem(THEME_KEY, nextTheme);
}

function handleKeyboard(event) {
  const intercepted = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '*', '/', '.', 'Enter', 'Backspace', 'Escape'
  ];

  if (!intercepted.includes(event.key)) {
    return;
  }

  event.preventDefault();

  if (/^\d$/.test(event.key)) {
    handleDigit(event.key);
    return;
  }

  switch (event.key) {
    case '+':
    case '-':
    case '*':
    case '/':
      handleOperator(event.key);
      break;
    case '.':
      handleDecimal();
      break;
    case 'Enter':
      handleEquals();
      break;
    case 'Backspace':
      handleBackspace();
      break;
    case 'Escape':
      clearAll();
      break;
    default:
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  loadHistory();
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  updateDisplay();

  if (elements.buttons) {
    elements.buttons.addEventListener('click', (event) => {
      const button = event.target.closest('button');

      if (!button) {
        return;
      }

      if (button.dataset.value !== undefined) {
        handleInput(button.dataset.value);
      }

      if (button.dataset.action) {
        handleAction(button.dataset.action);
      }
    });
  }

  if (elements.clearHistory) {
    elements.clearHistory.addEventListener('click', clearHistory);
  }

  if (elements.themeToggle) {
    elements.themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  document.addEventListener('keydown', handleKeyboard);
});
