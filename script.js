const display = document.getElementById("display");

let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

function addNumber(number) {
  if (display.value === "0" || waitingForSecondNumber) {
    display.value = number;
    waitingForSecondNumber = false;
  } else {
    display.value += number;
  }
}

function addDecimal() {
  if (waitingForSecondNumber) {
    display.value = "0.";
    waitingForSecondNumber = false;
    return;
  }

  if (!display.value.includes(".")) {
    display.value += ".";
  }
}

function chooseOperator(selectedOperator) {
  const currentNumber = parseFloat(display.value);

  if (operator && waitingForSecondNumber) {
    operator = selectedOperator;
    return;
  }

  if (firstNumber === null) {
    firstNumber = currentNumber;
  } else if (operator) {
    firstNumber = performCalculation(
      firstNumber,
      currentNumber,
      operator
    );

    display.value = firstNumber;
  }

  operator = selectedOperator;
  waitingForSecondNumber = true;
}

function calculate() {
  if (operator === null || firstNumber === null) {
    return;
  }

  const secondNumber = parseFloat(display.value);

  firstNumber = performCalculation(
    firstNumber,
    secondNumber,
    operator
  );

  display.value = firstNumber;

  operator = null;
  waitingForSecondNumber = false;
}

function performCalculation(a, b, op) {
  switch (op) {
    case "+":
      return a + b;

    case "-":
      return a - b;

    case "*":
      return a * b;

    case "/":
      if (b === 0) {
        return "Error";
      }
      return a / b;

    default:
      return b;
  }
}

function clearDisplay() {
  display.value = "0";
  firstNumber = null;
  operator = null;
  waitingForSecondNumber = false;
}

function deleteLast() {
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1);
  } else {
    display.value = "0";
  }
}

function percentage() {
  const number = parseFloat(display.value);
  display.value = number / 100;
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (!isNaN(key)) {
    addNumber(key);
  }

  if (key === ".") {
    addDecimal();
  }

  if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  }

  if (key === "Enter" || key === "=") {
    calculate();
  }

  if (key === "Escape") {
    clearDisplay();
  }

  if (key === "Backspace") {
    deleteLast();
  }

  if (key === "%") {
    percentage();
  }
});
