import { For, Show } from "solid-js";
import { IoPlay, IoEllipsisVertical } from "solid-icons/io";
import styles from "./MediaTile.module.scss";

export type MediaTileProps = {
  albumArt: MusicKit.Artwork;
  title: string;
  artist: string[];
  type: MusicKit.MediaItemType;
  id: string;
};

export function MediaTile(props: MediaTileProps) {
  return (
    <div class={styles.mediaTile}>
      <div class={styles.mediaTile__overlay}>
        <div class={styles.mediaTile__overlay__inner}>
          <IoPlay
            size={40}
            class={styles.mediaTile__overlay__inner__button}
            onclick={async () => {
              console.log(props.id);
              console.log(props.type);
              await MusicKit.getInstance().setQueue({
                album: props.id,
                startPlaying: true,
              });
            }}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTile__overlay__inner__button__more}
          />
        </div>
        <img
          class={styles.mediaTile__image}
          src={props.albumArt.url}
          alt="Album Art"
        />
      </div>
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
