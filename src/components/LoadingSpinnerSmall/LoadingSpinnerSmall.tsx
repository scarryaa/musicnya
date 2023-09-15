import styles from './LoadingSpinnerSmall.module.scss';

export function LoadingSpinnerSmall() {
  return (
    <div class={styles.loadingSpinner}>
      <div class={styles.loadingSpinner__inner}></div>
    </div>
  );
}
