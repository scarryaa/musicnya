import styles from "./MediaShelf.module.scss";
import { IoCaretBack, IoCaretForward } from "solid-icons/io";

export type MediaShelfProps = {
  children: any;
  class?: string;
  title?: string;
};

export function MediaShelf(props: MediaShelfProps) {
  return (
    <div class={styles.mediaShelf + props.class}>
      <h2 class={styles.mediaShelf__title}>{props.title}</h2>
      <div class={styles.mediaShelf__controls}>
        <button class={styles.mediaShelf__controls__button}>
          <IoCaretBack size={20} />
        </button>
        <button class={styles.mediaShelf__controls__button}>
          <IoCaretForward size={20} />
        </button>
      </div>
      <div class={styles.mediaShelf__inner}>
        <div class={styles.mediaShelf__inner__content}>{props.children}</div>
      </div>
    </div>
  );
}
