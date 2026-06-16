# Squad Decisions

## Active Decisions

### 2026-06-16T09-53-03: Place theme toggle in calculator header and keep history as a separate card below the keypad
**By:** Trinity
**What:** Place theme toggle in calculator header and keep history as a separate card below the keypad
**References:** index.html, style.css
**Why:** Implemented the calculator markup and styling with the agreed interface contract. The theme toggle is positioned in the calculator header for clear top-right placement, while the history area is rendered as a separate card below the calculator for cleaner hierarchy and easier future JS wiring. Styling uses the team-approved CSS custom property theme system with body.dark overrides, semantic HTML structure, and responsive button grid behavior.

### 2026-06-16T09-53-16: Created a comprehensive calculator test plan
**By:** Tank
**What:** Created a comprehensive calculator test plan
**References:** TEST-PLAN.md, C:\work\AI\demo-squad-app\.squad\agents\tank\charter.md
**Why:** Prepared TEST-PLAN.md covering arithmetic correctness, chained-operation behavior, reset/backspace rules, decimal formatting, division-by-zero handling, large/small number rendering, negate behavior, keyboard shortcuts, history behavior, localStorage persistence, theme toggling, and browser-default prevention. The plan emphasizes edge cases that commonly fail in vanilla JavaScript calculators, especially floating-point formatting, waiting-for-operand state transitions, repeated equals, malformed localStorage recovery, and preventDefault verification for keyboard shortcuts.

### 2026-06-16T10-08-37: Document calculator usage and Codespaces workflow in README
**By:** Oracle
**What:** Document calculator usage and Codespaces workflow in README
**References:** README.md, .squad/agents/oracle/charter.md, .squad/decisions.md
**Why:** Prepared a complete README structure for the vanilla calculator with first-run instructions for both direct browser opening and GitHub Codespaces. The document emphasizes reproducible steps, clear feature coverage, keyboard shortcuts, project structure, and a short implementation overview so a new developer can use the app without any build tooling or dependency setup.

### 2026-06-16T10-08-58: Created Mermaid calculator architecture diagrams
**By:** Mouse
**What:** Created Mermaid calculator architecture diagrams
**References:** DIAGRAMS.md, index.html, script.js, style.css
**Why:** Added DIAGRAMS.md containing five GitHub-native Mermaid diagrams for the calculator: project architecture, calculator state machine, click and keyboard input flow, equals/history sequence, and theme toggle flow. The diagrams mirror the actual DOM selectors, localStorage keys, state fields, and event routing implemented in index.html, script.js, and style.css so future contributors can understand the app visually without reverse-engineering the code.

### 2026-06-16T11:43:47+02:00: Calculator architecture decisions
**By:** Morpheus
**What:** 
- Use a three-file structure: `index.html` for markup, `style.css` for presentation, and `script.js` for calculator behavior.
- Lock the DOM contract to these selectors and semantics: `#expression` for the in-progress expression text, `#display` for the active value/result, `#history-list` for the history `<ul>`, `#history-section` for the history wrapper, `#theme-toggle` for the theme switch button, and `#clear-history` for the history reset button.
- Standardize button metadata and classes so HTML, CSS, and JS integrate predictably: all input buttons use `data-value`; named action buttons use `data-action` with `clear`, `backspace`, `equals`, `decimal`, and `negate`; operators use `class="btn-operator"`; numeric buttons use `class="btn-number"`; utility/action buttons use `class="btn-action"`; the equals button uses `class="btn-equals"`.
- Use a small explicit JS state model with `currentValue` (string), `previousValue` (string), `operator` (string or `null`), `waitingForOperand` (boolean), and `justEvaluated` (boolean).
- Disallow `eval()` entirely; perform arithmetic through explicit operator handling with a switch/case implementation.
- Persist only two localStorage keys: `calc_history` for a JSON array of history entry strings and `calc_theme` for the current theme string (`"dark"` or `"light"`).
- Store history entries as strings in the format `"12 + 5 = 17"`, cap history at 50 items, and render newest entries first.
- Implement theming with CSS custom properties defined on `:root`, with dark mode activated by adding `dark` to the `<body>` class list.
**Why:**
- Separating HTML, CSS, and JS keeps ownership boundaries clean across the squad and avoids mixed concerns in a small vanilla application.
- A fixed selector and attribute contract removes ambiguity between structure, styling, and behavior, which is critical because Trinity and Neo will build against the same DOM surface independently.
- The chosen state model is minimal but sufficient for chained calculations, operator handoff, and post-evaluation behavior without introducing unnecessary complexity.
- Avoiding `eval()` improves safety, keeps operator behavior explicit, and makes the calculator logic easier to test and reason about.
- Restricting persistence to well-named localStorage keys keeps state portable and predictable while supporting the required history and theme features.
- Defining the history format, ordering, and retention limit ensures a consistent UI and prevents unbounded storage growth.
- Using CSS variables plus a `body.dark` toggle provides a simple, maintainable theming mechanism that does not require duplicating component styles.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction