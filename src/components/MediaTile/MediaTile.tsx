import { For, Show } from "solid-js";
import styles from "./MediaTile.module.scss";

export type MediaTileProps = {
  albumArt: string;
  title: string;
  artist: string[];
};

export function MediaTile(props: MediaTileProps) {
  return (
    <div class={styles.mediaTile}>
      <img
        class={styles.mediaTile__image}
        src={props.albumArt}
        alt="Album Art"
      />
      <div class={styles.mediaTile__songInfo}>
        <div class={styles.mediaTile__songInfo__title}>{props.title}</div>
        <div class={styles.mediaTile__songInfo__artist}>
          <For each={props.artist}>
            {(artist) => (
              <span class={styles.mediaTile__songInfo__artist__name}>
                {artist}
                <Show
                  when={
                    props.artist.length > 1 &&
                    artist !== props.artist[props.artist.length - 1]
                  }
                >
                  <span class={styles.mediaTile__songInfo__artist__separator}>
                    ,{" "}
                  </span>
                </Show>
              </span>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
