# Vanilla JS Calculator Test Plan

This plan focuses on correctness, edge cases, keyboard behavior, persistence, and browser-default prevention for the calculator UI.

## 1. Basic Arithmetic

**T-1: Addition returns correct result**
- Steps: Enter `2`, press `+`, enter `3`, press `=`.
- Expected: Main display shows `5`; expression/history entry uses `2 + 3 = 5`.
- Edge: Basic state transitions can fail if operand buffering or operator storage is wrong.

**T-2: Subtraction returns correct result**
- Steps: Enter `9`, press `-`, enter `4`, press `=`.
- Expected: Main display shows `5`; expression/history entry reflects subtraction.
- Edge: Minus is often overloaded between subtraction and negation.

**T-3: Multiplication returns correct result**
- Steps: Enter `7`, press `*`, enter `8`, press `=`.
- Expected: Main display shows `56`; history uses the `×` symbol.
- Edge: UI symbol mapping can differ from internal `*` handling.

**T-4: Division returns integer without trailing decimal**
- Steps: Enter `6`, press `/`, enter `2`, press `=`.
- Expected: Main display shows `3`, not `3.0` or `3.00`.
- Edge: Formatting logic may always stringify numeric results with decimals.

**T-5: One third displays a rounded decimal cleanly**
- Steps: Enter `1`, press `/`, enter `3`, press `=`.
- Expected: Main display shows a readable rounded decimal for one third, without layout overflow.
- Edge: Precision formatting can expose long floating-point tails.

**T-6: One quarter displays exact decimal**
- Steps: Enter `1`, press `/`, enter `4`, press `=`.
- Expected: Main display shows `0.25`.
- Edge: Decimal formatting should preserve exact finite fractions.

**T-7: Two thirds displays a rounded decimal cleanly**
- Steps: Enter `2`, press `/`, enter `3`, press `=`.
- Expected: Main display shows a readable rounded decimal for two thirds, without layout overflow.
- Edge: Repeating decimals may round inconsistently across formatting branches.

**T-8: Negative input arithmetic works**
- Steps: Enter `5`, press `+/−`, press `+`, enter `3`, press `=`.
- Expected: Main display shows `-2`.
- Edge: Negated numbers often break when the sign is stored separately from digits.

## 2. Chained Operations

**T-9: Chained operations evaluate left to right**
- Steps: Enter `1`, `2`, press `+`, enter `5`, press `*`, enter `2`, press `=`.
- Expected: After pressing `*`, main display shows `17`; after `=`, main display shows `34`; expression display reflects left-to-right chaining, not operator precedence.
- Edge: Many calculators or naive implementations accidentally apply multiplication precedence.

**T-10: Pressing equals multiple times after evaluation is idempotent**
- Steps: Enter `4`, press `+`, enter `1`, press `=`, then press `=` two more times.
- Expected: Main display stays `5`; no extra history entries are created.
- Edge: Some implementations repeat the last operation or double-log results.

**T-11: Pressing operator after equals continues from prior result**
- Steps: Enter `8`, press `-`, enter `3`, press `=`, then press `+`, enter `2`, press `=`.
- Expected: First result is `5`; second result is `7`; the new calculation starts from the evaluated result.
- Edge: Post-evaluation state may be lost or reset incorrectly.

**T-12: Pressing digit after equals starts a fresh calculation**
- Steps: Enter `8`, press `-`, enter `3`, press `=`, then press `7`.
- Expected: Main display becomes `7`; previous result/expression is cleared from active input state.
- Edge: Result state can incorrectly append digits (`57`) instead of starting over.

**T-13: Intermediate expression display updates during chaining**
- Steps: Enter `9`, press `+`, enter `1`, press `-`, enter `2`.
- Expected: Expression display shows the prior evaluated portion plus pending operator/operand state; main display shows the active operand.
- Edge: Expression text often desynchronizes from calculator state during multi-step input.

## 3. AC and Reset

**T-14: AC clears main display to zero**
- Steps: Enter `1`, `2`, `3`, press `AC`.
- Expected: Main display shows `0`.
- Edge: Reset code may clear state but leave stale display text.

**T-15: AC clears the intermediate expression display**
- Steps: Enter `4`, press `+`, enter `5`, verify expression is visible, then press `AC`.
- Expected: Expression display becomes empty or default blank state.
- Edge: Secondary display is often forgotten during resets.

**T-16: AC does not clear history**
- Steps: Complete one calculation with `=`, confirm a history entry exists, then press `AC`.
- Expected: Main/expression displays reset, but history list remains unchanged.
- Edge: Over-broad reset handlers may wipe unrelated persisted state.

**T-17: Calculator works normally after AC**
- Steps: Enter `7`, press `*`, enter `6`, press `AC`, then enter `2`, press `+`, enter `2`, press `=`.
- Expected: Final result is `4`.
- Edge: Reset may leave flags like `waitingForOperand` or `operator` in a bad state.

## 4. Backspace

**T-18: Backspace deletes the last digit**
- Steps: Enter `1`, `2`, `3`, press `Backspace`.
- Expected: Main display changes from `123` to `12`.
- Edge: Backspace logic can remove too much or fail on string/number conversion.

**T-19: Backspace on a single digit reverts to zero**
- Steps: Enter `8`, press `Backspace`.
- Expected: Main display shows `0`.
- Edge: Empty-string results can leave the display blank instead of normalized to zero.

**T-20: Backspace is ignored after evaluation**
- Steps: Enter `3`, press `+`, enter `4`, press `=`, then press `Backspace`.
- Expected: Evaluated result remains unchanged.
- Edge: Post-equals state can accidentally allow destructive edits to final results.

**T-21: Backspace is ignored while waiting for the next operand**
- Steps: Enter `9`, press `+`, then press `Backspace`.
- Expected: Main display remains `9` or the pending state remains unchanged; no deletion occurs on a non-active operand.
- Edge: Waiting-for-operand mode often mishandles input guards.

## 5. Decimal Handling

**T-22: Floating-point addition is displayed cleanly**
- Steps: Enter `0`, `.`, `1`, press `+`, enter `0`, `.`, `2`, press `=`.
- Expected: Main display shows `0.3`, not `0.30000000000000004`.
- Edge: Raw JavaScript floating-point output is a classic display bug.

**T-23: Multiple decimal presses are ignored**
- Steps: Enter `1`, press `.`, press `.`, enter `5`.
- Expected: Main display shows `1.5`.
- Edge: Duplicate decimal insertion can create invalid numeric strings.

**T-24: Decimal entry works immediately after an operator**
- Steps: Enter `5`, press `+`, press `.`, enter `3`, press `=`.
- Expected: The second operand starts as `0.3`; final result is `5.3`.
- Edge: New-operand initialization often forgets the leading zero before decimals.

**T-25: Leading decimal starts with zero**
- Steps: On a fresh calculator, press `.`.
- Expected: Main display shows `0.`.
- Edge: Starting with `.` may render as just `.` or fail input parsing.

## 6. Division by Zero

**T-26: Division by zero shows Error**
- Steps: Enter `5`, press `/`, enter `0`, press `=`.
- Expected: Main display shows `Error`.
- Edge: JavaScript may produce `Infinity` unless explicitly trapped.

**T-27: AC recovers from Error state**
- Steps: Produce `Error` with division by zero, then press `AC`.
- Expected: Main display returns to `0`; calculator accepts new input normally.
- Edge: Error state can linger and block later operations.

**T-28: Error results are not written to history**
- Steps: Note current history length, produce `5 / 0 = Error`, then inspect history.
- Expected: No new history entry is added.
- Edge: Logging may happen before result validation.

## 7. Large and Small Numbers

**T-29: Very large results switch to exponential notation**
- Steps: Enter `999999999`, press `*`, enter `999999999`, press `=`.
- Expected: Main display uses exponential notation or another defined compact overflow-safe format.
- Edge: Large integer rendering can overflow the display or lose formatting consistency.

**T-30: Very small results switch to exponential notation**
- Steps: Enter `0.000001`, press `*`, enter `0.000001`, press `=`.
- Expected: Main display uses exponential notation or another defined compact tiny-number format.
- Edge: Very small values may round to `0` unexpectedly.

**T-31: Input is capped at 15 digits**
- Steps: Enter digits continuously beyond 15 numeric characters.
- Expected: Additional digits are ignored once the 15-digit cap is reached, or input is otherwise limited per spec without corrupting state.
- Edge: Missing cap enforcement can break layout or precision assumptions.

## 8. Negate (+/−)

**T-32: Negating a positive number makes it negative**
- Steps: Enter `5`, press `+/−`.
- Expected: Main display shows `-5`.
- Edge: Negate may prepend a sign visually without updating numeric state.

**T-33: Negating a negative number returns it to positive**
- Steps: Enter `5`, press `+/−`, then press `+/−` again.
- Expected: Main display shows `5`.
- Edge: Double-negation can produce malformed strings like `--5`.

**T-34: Negating zero keeps zero**
- Steps: On `0`, press `+/−`.
- Expected: Main display remains `0`.
- Edge: Some implementations show `-0`, which is confusing and unstable.

**T-35: Negate behavior is correct while waiting for operand**
- Steps: Enter `5`, press `+`, then press `+/−`.
- Expected: Behavior matches product spec consistently: either ignored, or starts the next operand as negative without corrupting the pending operation.
- Edge: Waiting-for-operand state is a common gap where negate applies to the wrong value.

## 9. Keyboard

**T-36: Number keys 0-9 enter the correct digits**
- Steps: Use only keyboard keys `0` through `9` to enter a multi-digit number.
- Expected: Main display matches the typed sequence exactly.
- Edge: Key handling may differ between top-row digits and numpad digits.

**T-37: Operator keys trigger the correct operations**
- Steps: Use keyboard `+`, `-`, `*`, `/` to perform four separate calculations.
- Expected: Each operator behaves identically to clicking its on-screen button.
- Edge: Keyboard events can map to different symbols or be blocked by browser defaults.

**T-38: Enter key triggers equals**
- Steps: Enter `2`, `+`, `2` with keyboard, then press `Enter`.
- Expected: Main display shows `4`.
- Edge: Enter handling can submit forms or do nothing if not bound correctly.

**T-39: Keyboard Backspace deletes input and does not navigate away**
- Steps: Enter digits, press keyboard `Backspace`.
- Expected: Last digit is removed; the browser does not navigate back.
- Edge: Missing `preventDefault` can trigger browser history navigation.

**T-40: Escape key triggers AC**
- Steps: Enter a partial expression, then press `Escape`.
- Expected: Displays reset exactly as if `AC` were clicked.
- Edge: Escape is commonly reserved by the browser or other UI layers.

**T-41: Period key triggers decimal input**
- Steps: Use keyboard `.` to begin a number and again within another operand after an operator.
- Expected: Decimal input works the same as clicking the decimal button.
- Edge: Decimal handlers may only support button clicks or existing numeric strings.

**T-42: Rapid keyboard input does not break calculator state**
- Steps: Quickly type a valid sequence such as `1`, `2`, `+`, `3`, `4`, `Enter`, repeated several times.
- Expected: Results remain correct; no dropped characters, duplicate operations, or frozen UI.
- Edge: Fast key events can expose race conditions in state updates.

## 10. History

**T-43: Each successful equals adds exactly one history entry**
- Steps: Complete one valid calculation, inspect history, then complete a second valid calculation.
- Expected: History count increments by one per successful `=`.
- Edge: History may log twice if both operator execution and equals handler append entries.

**T-44: History entry format is human-readable and uses proper symbols**
- Steps: Complete calculations for subtraction, multiplication, and division.
- Expected: Entries follow `{a} {op} {b} = {result}` and display `×`, `÷`, and `−` instead of raw JS operator characters where applicable.
- Edge: Internal operator tokens often leak directly into UI text.

**T-45: Newest history entry appears first**
- Steps: Complete two different calculations in sequence.
- Expected: The second calculation appears above the first one in history.
- Edge: Append-vs-prepend mistakes reverse chronology.

**T-46: History is capped at 50 entries**
- Steps: Complete 51 successful calculations.
- Expected: Only 50 entries remain; the newest 50 are kept and the oldest is removed.
- Edge: Off-by-one logic is easy to get wrong at capacity boundaries.

**T-47: History persists across page reload**
- Steps: Complete multiple valid calculations, reload the page.
- Expected: History list is restored in the same newest-first order.
- Edge: localStorage restore code may not run early enough or may overwrite existing DOM incorrectly.

**T-48: Clear history removes visible entries and persisted data**
- Steps: Populate history, click `Clear history`, then reload the page.
- Expected: History list becomes empty immediately and stays empty after reload; localStorage history key is cleared or reset.
- Edge: UI clearing and storage clearing often get implemented separately and drift.

**T-49: Error results are excluded from history even between valid entries**
- Steps: Complete one valid calculation, produce division-by-zero `Error`, then complete another valid calculation.
- Expected: Only the two valid calculations appear in history.
- Edge: Conditional history filtering can fail when state moves from valid to error and back.

## 11. localStorage Persistence

**T-50: History survives reload through localStorage**
- Steps: Create history entries, reload the page, inspect stored and restored history.
- Expected: History contents survive reload and match pre-reload state.
- Edge: Serialization/deserialization mismatches can silently drop data.

**T-51: Theme survives reload through localStorage**
- Steps: Switch theme, reload the page.
- Expected: Previously selected theme is restored on load.
- Edge: Theme may apply after initial paint, causing incorrect startup state.

**T-52: Fresh page with no localStorage defaults safely**
- Steps: Clear calculator-related localStorage keys, load the page.
- Expected: Light theme is active and history is empty.
- Edge: Missing-key handling can produce null errors or unintended defaults.

**T-53: Malformed localStorage data falls back gracefully**
- Steps: Manually seed malformed JSON in the calculator’s history and/or theme localStorage keys, then load the page.
- Expected: App does not crash; invalid data is ignored or reset to defaults.
- Edge: Unhandled `JSON.parse` failures can block app initialization entirely.

## 12. Theme Toggle

**T-54: Theme toggle switches between light and dark**
- Steps: Click the theme toggle twice.
- Expected: First click changes the theme; second click restores the original theme.
- Edge: Toggle state and applied CSS class can become inverted.

**T-55: Theme toggle shows the correct emoji for the active action/state**
- Steps: Observe the emoji before and after toggling themes.
- Expected: The button shows the intended `🌙` / `☀️` indicator consistently with product design.
- Edge: Text/icon state can lag behind the actual applied theme.

**T-56: Toggle button remains visually distinct in both themes**
- Steps: Inspect the toggle button in light mode and dark mode.
- Expected: Contrast, background, and icon visibility remain clear in both themes.
- Edge: Theme CSS variables often miss control-level styling.

**T-57: Theme transition is smooth and does not flash**
- Steps: Toggle theme several times and reload with dark theme already persisted.
- Expected: Transition is visually smooth and reload does not flash the wrong theme before applying the saved one.
- Edge: Theme application after first paint causes a flash-of-incorrect-theme issue.

**T-58: Persisted theme remains correct after reload**
- Steps: Set dark theme, reload, then set light theme and reload again.
- Expected: Each reload reflects the most recently chosen theme.
- Edge: Persistence writes may be stale or one-way only.

## 13. Browser Default Prevention and Accessibility

**T-59: Slash key does not trigger browser quick-search/search UI**
- Steps: Focus the page, press `/`.
- Expected: Calculator registers division input only; browser search/quick-find does not open.
- Edge: `/` commonly activates search features if `preventDefault` is missing.

**T-60: Number keys do not trigger browser quick-find**
- Steps: Focus the page outside any text field and press several number keys.
- Expected: Only calculator input changes; no browser quick-find or page search behavior appears.
- Edge: Some browsers start find-in-page on unhandled keypresses.

**T-61: Escape does not trigger unintended browser or UI dismissal behavior**
- Steps: With the calculator loaded and no modal/dialog open, press `Escape`.
- Expected: Only calculator AC behavior occurs; no unrelated page behavior is triggered.
- Edge: Global Escape handlers can interfere with app-specific handling.

**T-62: Tab key can focus interactive buttons in a usable order**
- Steps: Use `Tab` and `Shift+Tab` to move through calculator controls.
- Expected: Buttons are focusable, focus is visible, and tab order is logical for keyboard users.
- Edge: Accessibility often regresses when controls rely on non-semantic elements or custom focus styling.
