import { JSXElement } from 'solid-js';
import styles from './Chip.module.scss';

export interface ChipProps {
  label: string
  onClick: () => void
  style?: string
  icon?: any
  class?: string
}

export function Chip(props: ChipProps) {
  return (
    <button
      class={styles.chip + ' ' + props.class}
      onClick={props.onClick}
      style={props.style}
    >
      <span class={styles.chip__icon}>{props.icon}</span>
      <span class={styles.chip__label}>{props.label}</span>
    </button>
  );
}
