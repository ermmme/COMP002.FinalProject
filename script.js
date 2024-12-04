document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const lastResultDisplay = document.getElementById("last-result-display");
  let currentInput = ""; // Holds the current input string
  let resultDisplayed = false; // Tracks if the result is currently displayed

  // Load the last expression and result from local storage
  const loadLastResult = () => {
    const lastData = JSON.parse(localStorage.getItem("lastResult"));
    if (lastData) {
      lastResultDisplay.textContent = `${lastData.expression} = ${lastData.result}`;
    }
  };

  // Save the last expression and result to local storage
  const saveLastResult = (expression, result) => {
    localStorage.setItem("lastResult", JSON.stringify({ expression, result }));
  };

  // Update the calculator display
  const updateDisplay = () => {
    display.textContent = currentInput || "0"; // Default display shows 0
  };

  // Handle button clicks
  const handleButtonClick = (value) => {
    if (resultDisplayed && !["C", "="].includes(value)) {
      // Clear input if user starts entering a new expression after result
      currentInput = "";
      resultDisplayed = false;
    }

    if (value === "C") {
      // Clear the input and reset states
      currentInput = "";
      resultDisplayed = false;
      enableButtons();
    } else if (value === "=") {
      // Evaluate the current expression
      try {
        const result = eval(currentInput); // Use eval cautiously
        saveLastResult(currentInput, result); // Save to local storage
        lastResultDisplay.textContent = `${currentInput} = ${result}`;
        currentInput = `${result}`;
        resultDisplayed = true;
        disableButtons();
      } catch {
        currentInput = "Error"; // Handle invalid input gracefully
        resultDisplayed = true;
        disableButtons();
      }
    } else {
      // Append value to the current input, preventing invalid zero padding
      const lastChar = currentInput.slice(-1);
      if (value === "0" && (currentInput === "" || lastChar === "0")) return; // Prevent padding
      if (["+", "-", "*", "/"].includes(value) && "+-*/".includes(lastChar))
        return; // Prevent consecutive operators
      currentInput += value;
    }

    updateDisplay(); // Update the display after each action
  };

  // Disable all buttons except "clear"
  const disableButtons = () => {
    document
      .querySelectorAll(".calculator-button:not(#button-clear)")
      .forEach((button) => (button.disabled = true));
  };

  // Enable all buttons
  const enableButtons = () => {
    document
      .querySelectorAll(".calculator-button")
      .forEach((button) => (button.disabled = false));
  };

  // Handle keyboard input
  const handleKeyboardInput = (event) => {
    const allowedKeys = "0123456789+-*/=C";
    if (allowedKeys.includes(event.key)) {
      const keyMap = { Enter: "=", c: "C" };
      handleButtonClick(keyMap[event.key] || event.key);
    }
  };

  // Attach event listeners to buttons
  document.querySelectorAll(".calculator-button").forEach((button) => {
    button.addEventListener("click", () =>
      handleButtonClick(button.textContent)
    );
  });

  // Attach keyboard event listener
  document.addEventListener("keydown", handleKeyboardInput);

  // Initialize the calculator on page load
  loadLastResult(); // Load the last result from local storage
  updateDisplay(); // Ensure the display shows the correct initial state
});
