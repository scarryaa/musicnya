import type { JSX } from "solid-js";
import styles from "./Songs.module.scss";

export function Songs(): JSX.Element {
  return <div class={styles.songs}></div>;
}
