import './index.css'
import styles from './App.module.css'
import { useCalculator } from './hooks/useCalculator'
import { useHistory } from './hooks/useHistory'
import { useTheme } from './hooks/useTheme'
import Display from './components/Display'
import ButtonGrid from './components/ButtonGrid'
import HistoryLog from './components/HistoryLog'
import ThemeToggle from './components/ThemeToggle'
import cardStyles from './components/CalcCard.module.css'

export default function App() {
  const { history, addToHistory, clearHistory } = useHistory()
  const { currentValue, expression, handleInput, handleAction } = useCalculator(addToHistory)
  const { theme, toggleTheme } = useTheme()

  return (
    <main className={styles.appShell}>
      <div className={cardStyles.card}>
        <div className={cardStyles.header}>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <Display expression={expression} currentValue={currentValue} />
        <ButtonGrid onInput={handleInput} onAction={handleAction} />
      </div>
      <HistoryLog history={history} onClear={clearHistory} />
    </main>
  )
}
