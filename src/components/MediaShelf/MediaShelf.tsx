import styles from "./MediaShelf.module.scss";
import { IoCaretBack, IoCaretForward } from "solid-icons/io";

export type MediaShelfProps = {
  children: any;
  class?: string;
  title?: string;
};

export function MediaShelf(props: MediaShelfProps) {
  let mediaShelf = null as unknown as HTMLElement;

  const scroll = (direction: string) => {
    // select the nearest parent element with the class of .mediaShelf__inner__content
    const shelf = mediaShelf.closest(
      `.${styles.mediaShelf__inner__content}`,
    ) as HTMLElement;

    const scrollAmount = shelf.offsetWidth;
    if (direction === "left") {
      shelf.scroll({
        left: shelf.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    } else {
      shelf.scroll({
        left: shelf.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div class={styles.mediaShelf + props.class}>
      <h2 class={styles.mediaShelf__title}>{props.title}</h2>
      <div class={styles.mediaShelf__controls}>
        <IoCaretBack
          size={20}
          class={styles.mediaShelf__controls__button}
          onClick={() => scroll("left")}
        />
        <IoCaretForward
          size={20}
          class={styles.mediaShelf__controls__button}
          onClick={() => scroll("right")}
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
