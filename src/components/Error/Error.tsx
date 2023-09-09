import styles from './Error.module.scss';

export const Error = (error: any) => {
  return (
    <div class={styles.error}>
      <h1>Something went wrong.</h1>
      <p>{error.message}</p>
    </div>
  );
};
