# Demo Squad App Calculator

A React 18 calculator rebuilt with Vite, CSS Modules, keyboard controls, saved history, and theme persistence.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-94%20tests-6E9F18?logo=vitest&logoColor=white)

## Screenshot

> **Screenshot placeholder**  
> Alt text: Calculator app with a theme toggle in the header, expression and result display, a four-column keypad with keyboard hints, and a history panel below the calculator.

## Features

- Basic arithmetic: `+`, `−`, `×`, `÷`
- Chained operations with intermediate result display
- `AC` resets the full calculator state
- Backspace deletes the last digit
- `+/−` toggles the current value sign
- History log stores up to 50 entries
- Newest history entries appear first
- History is persisted in `localStorage` with `calc_history`
- Clear history button
- Dark and light theme toggle
- Theme is persisted in `localStorage` with `calc_theme`
- Full keyboard support
- Keyboard shortcuts are shown on buttons

## Getting Started

Clone the repo, install dependencies, and start Vite.

### Prerequisites

- Node.js 18+
- npm

### Install and run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Run in GitHub Codespaces

1. Click **Code** → **Codespaces** → **Create codespace on main**.
2. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```

3. When the port `5173` notification appears, click **Open in Browser**.
4. Or open port `5173` from the **Ports** tab.

## Dev Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite dev server on `http://localhost:5173` |
| `npm test` | Run the full Vitest suite |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0`–`9` | Digit input |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `.` | Decimal point |
| `Enter` | Equals |
| `Backspace` | Delete last digit |
| `Escape` | AC — All Clear |

## Project Structure

```text
demo-squad-app/
├── index.html              # Vite entry point
├── vite.config.js          # Vite + Vitest config
├── package.json            # Scripts and dependencies
├── src/
│   ├── main.jsx            # React root
│   ├── App.jsx             # Root component, wires hooks + layout
│   ├── App.module.css      # App shell layout styles
│   ├── index.css           # Global CSS custom properties and theme tokens
│   ├── setupTests.js       # Vitest setup with jest-dom
│   ├── hooks/
│   │   ├── useCalculator.js  # useReducer state machine for calculator logic
│   │   ├── useHistory.js     # History state + localStorage sync
│   │   └── useTheme.js       # Theme state + localStorage sync
│   ├── components/
│   │   ├── Display.jsx         # Expression + current value display
│   │   ├── Button.jsx          # Single button with keyboard hint
│   │   ├── ButtonGrid.jsx      # All calculator buttons + keyboard handler
│   │   ├── HistoryLog.jsx      # Scrollable history + clear action
│   │   └── ThemeToggle.jsx     # Dark/light toggle button
│   └── __tests__/
│       ├── useCalculator.test.js
│       ├── useHistory.test.js
│       ├── useTheme.test.js
│       ├── Display.test.jsx
│       ├── Button.test.jsx
│       ├── ButtonGrid.test.jsx
│       ├── HistoryLog.test.jsx
│       ├── ThemeToggle.test.jsx
│       └── App.test.jsx
└── dist/                   # Production build output
```

## Testing

The app has **94 tests across 9 files**.

- Runner: **Vitest**
- UI testing: **React Testing Library**
- Coverage focus: calculator logic, history persistence, theme persistence, component rendering, keyboard input, and full app integration

Run the suite:

```bash
npm test
```

Run watch mode:

```bash
npm run test:watch
```

## Tech Stack

| Layer | Tooling |
| --- | --- |
| UI | React 18 |
| Build tool | Vite 6 |
| Styling | CSS Modules + global CSS custom properties |
| Testing | Vitest + React Testing Library |
| Persistence | Browser `localStorage` |

## Built By

Built by the **demo-squad** AI team in the **Matrix universe**.
