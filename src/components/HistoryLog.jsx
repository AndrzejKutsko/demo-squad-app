import styles from './HistoryLog.module.css'

export default function HistoryLog({ history, onClear }) {
  return (
    <section className={styles.section} aria-label="Calculation history">
      <div className={styles.header}>
        <h2 className={styles.title}>History</h2>
        <button type="button" className={styles.clearBtn} onClick={onClear}>
          Clear
        </button>
      </div>
      <ul className={styles.list} aria-live="polite">
        {history.length === 0 ? (
          <li className={styles.empty}>No calculations yet</li>
        ) : (
          history.map((entry, i) => (
            <li key={i} className={styles.entry}>
              {entry}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
