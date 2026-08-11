(function () {
  const readout = document.getElementById("readout");
  const trace = document.getElementById("trace");
  const pad = document.getElementById("pad");

  const state = {
    display: "0",
    firstOperand: null,
    operator: null,
    waitingForSecond: false,
    errored: false,
  };

  const OP_SYMBOLS = { "+": "+", "−": "−", "×": "×", "÷": "÷" };

  function formatNumber(numStr) {
    if (numStr === "ERROR") return numStr;
    const n = parseFloat(numStr);
    if (Number.isNaN(n)) return "0";
    let s = n.toPrecision(12);
    if (s.indexOf(".") !== -1) {
      s = s.replace(/0+$/, "").replace(/\.$/, "");
    }
    if ((Math.abs(n) < 1e15 && Math.abs(n) >= 1e-9) || n === 0) {
      s = parseFloat(s).toString();
    }
    return s;
  }

  function updateScreen() {
    readout.textContent = state.display;
    readout.classList.toggle("error", state.errored);

    if (state.operator && state.firstOperand !== null) {
      const opDisplay = state.waitingForSecond ? "" : state.display;
      trace.textContent =
        `${formatNumber(state.firstOperand)} ${OP_SYMBOLS[state.operator]} ${opDisplay}`.trim();
    } else {
      trace.textContent = "\u00A0";
    }

    document.querySelectorAll(".key-op").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.dataset.op === state.operator && state.waitingForSecond,
      );
    });
  }

  function resetIfErrored() {
    if (state.errored) {
      state.display = "0";
      state.firstOperand = null;
      state.operator = null;
      state.waitingForSecond = false;
      state.errored = false;
    }
  }

  function inputDigit(d) {
    resetIfErrored();
    if (state.waitingForSecond) {
      state.display = d;
      state.waitingForSecond = false;
    } else {
      state.display = state.display === "0" ? d : state.display + d;
    }
    updateScreen();
  }

  function inputDecimal() {
    resetIfErrored();
    if (state.waitingForSecond) {
      state.display = "0.";
      state.waitingForSecond = false;
      updateScreen();
      return;
    }
    if (state.display.indexOf(".") === -1) {
      state.display += ".";
    }
    updateScreen();
  }

  function backspace() {
    if (state.errored) {
      resetIfErrored();
      updateScreen();
      return;
    }
    if (state.waitingForSecond) return;
    state.display = state.display.length > 1 ? state.display.slice(0, -1) : "0";
    updateScreen();
  }

  function clearAll() {
    state.display = "0";
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecond = false;
    state.errored = false;
    updateScreen();
  }

  function percent() {
    resetIfErrored();
    const val = parseFloat(state.display);
    if (Number.isNaN(val)) return;
    state.display = formatNumber((val / 100).toString());
    updateScreen();
  }

  function compute(a, op, b) {
    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) return null; 
        return a / b;
      default:
        return b;
    }
  }

  function handleOperator(nextOp) {
    resetIfErrored();
    const inputValue = parseFloat(state.display);

    if (state.operator && state.waitingForSecond) {
      state.operator = nextOp;
      updateScreen();
      return;
    }

    if (state.firstOperand === null) {
      state.firstOperand = inputValue;
    } else if (state.operator) {
      const result = compute(state.firstOperand, state.operator, inputValue);
      if (result === null) {
        triggerError();
        return;
      }
      state.firstOperand = result;
      state.display = formatNumber(result.toString());
    }

    state.waitingForSecond = true;
    state.operator = nextOp;
    updateScreen();
  }

  function handleEquals() {
    resetIfErrored();
    if (state.operator === null || state.waitingForSecond) {
      updateScreen();
      return;
    }
    const inputValue = parseFloat(state.display);
    const result = compute(state.firstOperand, state.operator, inputValue);
    if (result === null) {
      triggerError();
      return;
    }
    trace.textContent = `${formatNumber(state.firstOperand)} ${OP_SYMBOLS[state.operator]} ${formatNumber(inputValue)} =`;
    state.display = formatNumber(result.toString());
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecond = false;
    readout.textContent = state.display;
  }

  function triggerError() {
    state.errored = true;
    state.display = "ERROR";
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecond = false;
    updateScreen();
  }

  function ripple(btn) {
    btn.classList.remove("ripple");
    void btn.offsetWidth;
    btn.classList.add("ripple");
    setTimeout(() => btn.classList.remove("ripple"), 350);
  }

  pad.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    ripple(btn);

    if (btn.dataset.digit !== undefined) {
      inputDigit(btn.dataset.digit);
      return;
    }

    switch (btn.dataset.action) {
      case "clear":
        clearAll();
        break;
      case "backspace":
        backspace();
        break;
      case "percent":
        percent();
        break;
      case "decimal":
        inputDecimal();
        break;
      case "operator":
        handleOperator(btn.dataset.op);
        break;
      case "equals":
        handleEquals();
        break;
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
      inputDigit(e.key);
      return;
    }
    if (e.key === ".") {
      inputDecimal();
      return;
    }
    if (e.key === "+") {
      handleOperator("+");
      return;
    }
    if (e.key === "-") {
      handleOperator("−");
      return;
    }
    if (e.key === "*") {
      handleOperator("×");
      return;
    }
    if (e.key === "/") {
      e.preventDefault();
      handleOperator("÷");
      return;
    }
    if (e.key === "Enter" || e.key === "=") {
      handleEquals();
      return;
    }
    if (e.key === "Backspace") {
      backspace();
      return;
    }
    if (e.key === "Escape") {
      clearAll();
      return;
    }
    if (e.key === "%") {
      percent();
      return;
    }
  });

  updateScreen();
})();
