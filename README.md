# demo-squad-app calculator

A browser-based calculator built with vanilla HTML, CSS, and JavaScript.

## Screenshot

> **Screenshot placeholder**  
> Alt text: Browser-based calculator with a theme toggle in the top-right corner, an expression line above a large result display, a four-column keypad with keyboard shortcut hints on each button, and a history panel below the calculator showing recent calculations.

## Features

- Basic arithmetic with `+`, `−`, `×`, and `÷`
- Chained operations with intermediate result updates before `=`
- `AC` to reset the calculator state
- Backspace to delete the last digit
- `+/−` to toggle the current value sign
- Calculation history shown below the calculator
- Newest history entries first, capped at 50 items
- History persistence with `localStorage`
- Clear history button
- Dark and light theme toggle
- Theme persistence with `localStorage`
- Keyboard support for number entry and actions
- Keyboard shortcuts shown on calculator buttons

## Getting Started

Open the calculator in a browser. No build step is required.

### Open locally

Open `index.html` in any modern browser.

No setup is required:

- No `npm install`
- No build step
- No dependencies
- No local server

### Run in GitHub Codespaces

Use this option if you want to run the project in a browser from a cloud dev environment.

1. Open the repository on GitHub.
2. Click **Code**.
3. Open the **Codespaces** tab.
4. Click **Create codespace on main**.
5. Wait for the Codespace to load.
6. Open a terminal in Codespaces.
7. Start a simple local server:

   ```bash
   python3 -m http.server 8080
   ```

   If the VS Code Live Server extension is available, you can use that instead.

8. When port `8080` is forwarded, click **Open in Browser**.
9. If the notification does not appear, open the **Ports** tab and open port `8080` manually.
10. The calculator will open in the browser.

There is still no extra setup:

- No `npm install`
- No build step
- No dependencies

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0`–`9` | Digit input |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `.` | Decimal point |
| `Enter` | Equals and evaluate |
| `Backspace` | Delete last digit |
| `Escape` | `AC` / all clear |

## Project Structure

```text
demo-squad-app/
├── index.html
├── style.css
├── script.js
└── README.md
```

- `index.html` — semantic calculator markup and history section
- `style.css` — layout, component styles, custom properties, and dark/light theme
- `script.js` — calculator state, chained-operation logic, keyboard handling, history, and `localStorage`
- `README.md` — project overview and usage instructions

## How It Works

The calculator uses a small JavaScript state model to track the current value, previous value, selected operator, and input flow between operations. It runs entirely in the browser with no frameworks or build tooling. History and theme preference are saved with `localStorage`, so they persist across page reloads.

## Team

This project was built by the `demo-squad-app` AI team.
