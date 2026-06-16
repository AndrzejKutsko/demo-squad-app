import styles from './Button.module.css'

export default function Button({ label, keyHint, variant, wide = false, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${wide ? styles.wide : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {label}
      <span className={styles.keyHint}>{keyHint}</span>
    </button>
  )
}
