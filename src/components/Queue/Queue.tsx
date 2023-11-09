import { IoInfinite } from "solid-icons/io";
import styles from "./Queue.module.scss";
import { setAutoplay } from "../../api/musickit";
import { For, createEffect, createSignal } from "solid-js";
import { replaceSrc } from "../../util/utils";
import { QueueItem } from "./QueueItem";
import { queue, queuePosition } from "../../stores/store";

export function Queue() {
  const [autoplay, _setAutoplay] = createSignal(true);

  createEffect(() => {
    if (autoplay()) {
      document.querySelectorAll(`.${styles.queue__autoplay}`).forEach((el) => {
        el.classList.add(styles.queue__autoplay__active);
      });
    } else {
      document.querySelectorAll(`.${styles.queue__autoplay}`).forEach((el) => {
        el.classList.remove(styles.queue__autoplay__active);
      });
    }
  });

  return (
    <div class={styles.queue}>
      <div class={styles.queue__header}>
        <h1>Queue</h1>
        <IoInfinite
          size={30}
          color={"var(--text)"}
          class={styles.queue__autoplay}
          onclick={async () => {
            await setAutoplay(autoplay());
            _setAutoplay(!autoplay());

            if (autoplay()) {
              document
                .querySelectorAll(`.${styles.queue__autoplay}`)
                .forEach((el) => {
                  el.classList.add(styles.queue__autoplay__active);
                });
            } else {
              document
                .querySelectorAll(`.${styles.queue__autoplay}`)
                .forEach((el) => {
                  el.classList.remove(styles.queue__autoplay__active);
                });
            }
          }}
        />
      </div>
      <div class={styles.queue__items}>
        <For each={queue.items.slice(queuePosition.value)}>
          {(item, index) => (
            <QueueItem
              class={
                queuePosition.value === index() ? styles.queue__current : ""
              }
              id={item.id}
              type={item.type}
              index={item.trackNumber || 0}
              isCurrentItem={index() === 0}
              mediaArt={{
                ...item.attributes?.artwork,
                url: replaceSrc(item.attributes?.artwork?.url, 50)
              }}
              title={item.title}
              artist={item.artistName}
              duration={item.playbackDuration}
              album={item.albumName}
              albumId={item._container.id}
            />
          )}
        </For>
      </div>
    </div>
  );
}
