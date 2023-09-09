import styles from './ButtonPrimary.module.scss';

export interface ButtonPrimaryProps {
  icon: any
  label: string
  onClick: () => void
}

export function ButtonPrimary(props: ButtonPrimaryProps) {
  return (
    <button class={styles.buttonPrimary} onClick={props.onClick}>
      <props.icon size={16} class={styles.buttonPrimary__icon} />
      <span class={styles.buttonPrimary__label}>{props.label}</span>
    </button>
  );
}
