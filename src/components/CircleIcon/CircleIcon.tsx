import styles from "./CircleIcon.module.scss";

export let style: string;

export function CircleIcon(props: any) {
  return (
    <div style={props.style} class={styles.circleIcon}>
      <slot />
    </div>
  );
}
