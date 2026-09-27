const previousDisplay = document.getElementById('previous');
const currentDisplay = document.getElementById('current');
const buttons = document.querySelectorAll('button');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  currentDisplay.textContent = currentInput;
  previousDisplay.textContent = previousInput;
}

function appendNumber(value) {
  if (currentInput === '0' || shouldResetDisplay) {
    currentInput = value;
    shouldResetDisplay = false;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }

  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function chooseOperator(nextOperator) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }

  previousInput = currentInput + ' ' + nextOperator;
  operator = nextOperator;
  shouldResetDisplay = true;
  currentInput = '0';
  updateDisplay();
}

function calculate() {
  if (!operator || !previousInput) return;

  const prev = parseFloat(previousInput.slice(0, -2));
  const current = parseFloat(currentInput);

  if (Number.isNaN(prev) || Number.isNaN(current)) return;

  let result = 0;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current === 0 ? 'Error' : prev / current;
      break;
    case '%':
      result = prev % current;
      break;
    default:
      return;
  }

  if (result === 'Error') {
    currentInput = 'Error';
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
    return;
  }

  currentInput = Number.isInteger(result)
    ? String(result)
    : String(parseFloat(result.toFixed(10)));
  previousInput = '';
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }

  updateDisplay();
}

function handleButtonValue(value) {
  if (/^[0-9]$/.test(value)) {
    appendNumber(value);
    return;
  }

  switch (value) {
    case '.':
      appendDecimal();
      break;
    case '+':
    case '-':
    case '*':
    case '/':
    case '%':
      chooseOperator(value);
      break;
    case '=':
      calculate();
      break;
    case 'clear':
      clearAll();
      break;
    case 'delete':
      deleteLast();
      break;
    default:
      break;
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    handleButtonValue(button.dataset.value);
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    event.preventDefault();
    handleButtonValue(key);
    return;
  }

  if (key === '.') {
    event.preventDefault();
    handleButtonValue('.');
    return;
  }

  if (['+', '-', '*', '/', '%'].includes(key)) {
    event.preventDefault();
    handleButtonValue(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    handleButtonValue('=');
    return;
  }

  if (key === 'Backspace') {
    event.preventDefault();
    handleButtonValue('delete');
    return;
  }

  if (key.toLowerCase() === 'c') {
    event.preventDefault();
    handleButtonValue('clear');
  }
});

updateDisplay();
