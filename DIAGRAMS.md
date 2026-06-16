# Calculator — Architecture Diagrams

Mermaid diagrams illustrating how the calculator is structured and how it works.
All diagrams render natively in GitHub markdown.

---

## 1. Project Architecture
This flowchart shows how the HTML, CSS, and JavaScript files connect the UI, behavior, and persistence layers.
```mermaid
graph TD
    HTML["index.html"]
    CSS["style.css"]
    JS["script.js"]
    ROOT[":root custom properties<br/>light theme"]
    DARK["body.dark custom properties<br/>dark theme"]
    CSSCOMP["UI styling classes<br/>.button-grid<br/>.btn-number<br/>.btn-operator<br/>.btn-action<br/>.btn-equals"]
    DOM["DOM elements<br/>#display<br/>#expression<br/>#history-list<br/>#theme-toggle"]
    GRID[".button-grid click events"]
    KEYS["document keydown events"]
    STORE["localStorage<br/>calc_history<br/>calc_theme"]

    HTML -->|"links stylesheet"| CSS
    HTML -->|"loads logic with defer"| JS

    CSS --> ROOT
    CSS --> DARK
    CSS --> CSSCOMP

    JS --> DOM
    JS --> GRID
    JS --> KEYS
    JS <-->|"reads and writes"| STORE
```

## 2. State Machine
This state diagram captures how calculator input moves between number entry, operator selection, evaluation, and reset.
```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle: display = "0" (no operator pending)
    EnteringNumber: user typing first number
    OperatorPressed: operator selected (waiting for operand)
    EnteringSecondNumber: user typing second number
    Evaluated: result shown

    Idle --> EnteringNumber: digit pressed
    EnteringNumber --> EnteringNumber: digit pressed / append
    EnteringNumber --> OperatorPressed: operator pressed
    OperatorPressed --> OperatorPressed: operator changed / replace
    OperatorPressed --> EnteringSecondNumber: digit pressed
    EnteringSecondNumber --> EnteringSecondNumber: digit pressed / append
    EnteringSecondNumber --> Evaluated: = pressed / compute result
    EnteringSecondNumber --> OperatorPressed: operator pressed / chain compute, set operator
    Evaluated --> EnteringNumber: digit pressed / start fresh
    Evaluated --> OperatorPressed: operator pressed / continue from result

    Idle --> Idle: Escape / AC
    EnteringNumber --> Idle: Escape / AC
    OperatorPressed --> Idle: Escape / AC
    EnteringSecondNumber --> Idle: Escape / AC
    Evaluated --> Idle: Escape / AC
```

## 3. Input Flow
This flowchart traces both mouse clicks and keyboard events from user input through routing helpers into display updates.
```mermaid
graph TD
    INPUT["User input<br/>(click or keydown)"]
    KB{"Keyboard event?"}
    HK["handleKeyboard()"]
    LIST{"Key in intercepted list?"}
    PREVENT["preventDefault()"]
    ROUTE["Route input"]
    EXIT["Ignore key and allow browser default"]
    CLICK["Event delegation on .button-grid"]
    BUTTON["Find closest button"]
    TYPE{"Button data type?"}
    INPUTVAL["data-value<br/>handleInput()"]
    KIND{"Digit or operator?"}
    DIGIT["handleDigit()"]
    OP["handleOperator()"]
    ACTION["data-action<br/>handleAction()"]
    CLEAR["clearAll()"]
    BACK["handleBackspace()"]
    EQUALS["handleEquals()"]
    DECIMAL["handleDecimal()"]
    NEGATE["handleNegate()"]
    UPDATE["updateDisplay()"]
    DOM["DOM updated"]

    INPUT --> KB
    KB -->|Yes| HK
    HK --> LIST
    LIST -->|Yes| PREVENT
    PREVENT --> ROUTE
    LIST -->|No| EXIT

    KB -->|No| CLICK
    CLICK --> BUTTON
    BUTTON --> TYPE

    ROUTE --> KIND
    TYPE -->|data-value| INPUTVAL
    INPUTVAL --> KIND
    KIND -->|digit| DIGIT
    KIND -->|operator| OP

    TYPE -->|data-action| ACTION
    ACTION -->|clear| CLEAR
    ACTION -->|backspace| BACK
    ACTION -->|equals| EQUALS
    ACTION -->|decimal| DECIMAL
    ACTION -->|negate| NEGATE

    DIGIT --> UPDATE
    OP --> UPDATE
    CLEAR --> UPDATE
    BACK --> UPDATE
    EQUALS --> UPDATE
    DECIMAL --> UPDATE
    NEGATE --> UPDATE
    UPDATE --> DOM
```

## 4. Equals & History
This sequence diagram shows how pressing equals computes the result, handles errors, and persists successful calculations into history.
```mermaid
sequenceDiagram
    participant User
    participant Calc as Calculator (script.js)
    participant Display as Display (#display, #expression)
    participant History as History (#history-list)
    participant Storage as localStorage

    User->>Calc: Press = or Enter
    Calc->>Calc: Check operator is set and not waitingForOperand
    Calc->>Calc: calculate(previousValue, currentValue, operator)
    Calc->>Calc: Format result with toPrecision or exponential notation

    alt Result is Error
        Calc->>Display: Show expression and "Error"
        Note over Calc,History: No history entry is added
    else Result is valid
        Calc->>Calc: Add "12 + 5 = 17" entry to history array
        Calc->>Storage: saveHistory() via setItem("calc_history", ...)
        Calc->>History: renderHistory()
        History-->>Calc: #history-list DOM updated
        Calc->>Calc: currentValue = result
        Calc->>Calc: clear operator
        Calc->>Calc: justEvaluated = true
        Calc->>Display: Update #expression with full expression
        Calc->>Display: Update #display with result
    end
```

## 5. Theme Toggle
This flowchart explains how the saved theme is restored on load, toggled by the user, and reflected through CSS custom properties.
```mermaid
graph TD
    LOAD["Page load"]
    READ["localStorage.getItem('calc_theme')"]
    SAVED{"Saved theme is 'dark'?"}
    DARKON["applyTheme('dark')<br/>add body.dark<br/>show ☀️"]
    LIGHTON["applyTheme('light')<br/>remove body.dark<br/>show 🌙"]
    CLICK["User clicks #theme-toggle"]
    CHECK{"body.classList.contains('dark')?"}
    TODARK["applyTheme('dark')"]
    TOLIGHT["applyTheme('light')"]
    SAVEDARK["Save 'dark'"]
    SAVELIGHT["Save 'light'"]
    CSSROOT[":root variables<br/>light colors"]
    CSSDARK["body.dark variables<br/>dark colors"]
    TRANSITION["transition: background-color 0.3s<br/>smooth switch"]

    LOAD --> READ
    READ --> SAVED
    SAVED -->|Yes| DARKON
    SAVED -->|No| LIGHTON

    CLICK --> CHECK
    CHECK -->|Yes| TOLIGHT
    CHECK -->|No| TODARK

    TOLIGHT --> SAVELIGHT
    TODARK --> SAVEDARK

    LIGHTON --> CSSROOT
    DARKON --> CSSDARK
    SAVELIGHT --> CSSROOT
    SAVEDARK --> CSSDARK
    CSSROOT --> TRANSITION
    CSSDARK --> TRANSITION
```
