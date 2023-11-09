import { IoInfinite } from "solid-icons/io";
import styles from "./Queue.module.scss";
import { setAutoplay } from "../../api/musickit";
import { For, createEffect, createSignal } from "solid-js";
import { replaceSrc } from "../../util/utils";
import { QueueItem } from "./QueueItem";
import { history, queue, queuePosition, setHistory } from "../../stores/store";
import * as config from "../../../config.json";

export function Queue() {
  const [autoplay, _setAutoplay] = createSignal(true);
  const [historyView, setHistoryView] = createSignal(false);

  createEffect(async () => {
    if (autoplay()) {
      document.querySelectorAll(`.${styles.queue__autoplay}`).forEach((el) => {
        el.classList.add(styles.queue__autoplay__active);
      });
    } else {
      document.querySelectorAll(`.${styles.queue__autoplay}`).forEach((el) => {
        el.classList.remove(styles.queue__autoplay__active);
      });
    }

    if (historyView()) {
      await fetch(
        "https://amp-api.music.apple.com/v1/me/recent/played/tracks?l=en-US&platform=web",
        {
          headers: {
            Authorization: `Bearer ${config.MusicKit.token}`,
            "music-user-token": config.MusicKit.musicUserToken
          }
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setHistory({ value: res.data });
        });

      console.log(history.value);
    }
  });

  return (
    <div class={styles.queue}>
      {historyView() ? (
        <>
          <div class={styles.queue__header}>
            <h1>History</h1>
          </div>
          <div class={styles.queue__items}>
            <For each={history.value}>
              {(item) => (
                <QueueItem
                  id={item.id}
                  type={item.type}
                  index={item.trackNumber || 0}
                  isCurrentItem={false}
                  mediaArt={{
                    ...item.attributes?.artwork,
                    url: replaceSrc(item.attributes?.artwork?.url, 50)
                  }}
                  title={item.attributes.name}
                  artist={item.attributes.artistName}
                  duration={item.attributes.durationInMillis}
                  album={item.attributes.albumName}
                />
              )}
            </For>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
      <div class={styles.queue__footer}>
        <div
          class={styles.queue__footer__history}
          onclick={() => setHistoryView(!historyView())}
        >
          {historyView() ? "Queue" : "History"}
        </div>
        <div class={styles.queue__footer__clear}>Clear</div>
      </div>
    </div>
  );
}
