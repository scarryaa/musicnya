import styles from './LoadingSpinner.module.scss';

export function LoadingSpinner() {
  return (
    <div class={styles.loadingSpinner}>
      <div class={styles.loadingSpinner__inner}></div>
    </div>
  );
}
