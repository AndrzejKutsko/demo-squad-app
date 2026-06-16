import styles from './Display.module.css'

export default function Display({ expression, currentValue }) {
  return (
    <section className={styles.display} aria-label="Calculator display">
      <div className={styles.expression} aria-live="polite">
        {expression}
      </div>
      <div className={styles.current} aria-live="polite">
        {currentValue || '0'}
      </div>
    </section>
  )
}
