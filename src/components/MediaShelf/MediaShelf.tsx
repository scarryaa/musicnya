import { Show } from "solid-js";
import styles from "./MediaShelf.module.scss";
import { IoCaretBack, IoCaretForward } from "solid-icons/io";

export interface MediaShelfProps {
  children: any;
  class?: string;
  title?: string;
  type: MusicKit.MediaItemType;
}

export function MediaShelf(props: MediaShelfProps) {
  // eslint-disable-next-line prefer-const -- causes app bug??
  let mediaShelf = null as unknown as HTMLDivElement;

  const scroll = (direction: string) => {
    const shelf = mediaShelf.closest(
      `.${styles.mediaShelf__inner__content}`
    ) as HTMLDivElement;

    const scrollAmount = shelf.offsetWidth;
    if (direction === "left") {
      shelf.scroll({
        left: shelf.scrollLeft - scrollAmount,
        behavior: "smooth"
      });
    } else {
      shelf.scroll({
        left: shelf.scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div class={styles.mediaShelf + " " + props.class}>
      <Show when={props.title}>
        <h2 class={styles.mediaShelf__title}>{props.title}</h2>
      </Show>
      <div class={styles.mediaShelf__controls}>
        <IoCaretBack
          size={20}
          class={styles.mediaShelf__controls__button}
          onClick={() => {
            scroll("left");
          }}
        />
        <IoCaretForward
          size={20}
          class={styles.mediaShelf__controls__button}
          onClick={() => {
            scroll("right");
          }}
        />
      </div>
      <div class={styles.mediaShelf__inner}>
        <div ref={mediaShelf} class={styles.mediaShelf__inner__content}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
