import { For, Show } from "solid-js";
import { IoPlay, IoEllipsisVertical } from "solid-icons/io";
import styles from "./MediaTileGlass.module.scss";

export type MediaTileProps = {
  albumArt: MusicKit.Artwork;
  title: string;
  artist: string[];
  type: MusicKit.MediaItemType;
  id: string;
};

export function MediaTileGlass(props: MediaTileProps) {
  return (
    <div class={styles.mediaTileGlass}>
      <div class={styles.mediaTileGlass__overlay}>
        <div class={styles.mediaTileGlass__overlay__inner}>
          <IoPlay
            size={40}
            class={styles.mediaTileGlass__overlay__inner__button}
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
            class={styles.mediaTileGlass__overlay__inner__button__more}
          />
        </div>
        <img
          loading="lazy"
          decoding="async"
          class={styles.mediaTileGlass__image}
          src={props.albumArt.url}
          alt="Album Art"
        />
      </div>
      <div class={styles.mediaTileGlass__songInfo}>
        <div class={styles.mediaTileGlass__songInfo__title}>{props.title}</div>
        <div class={styles.mediaTileGlass__songInfo__artist}>
          <For each={props.artist}>
            {(artist) => (
              <span class={styles.mediaTileGlass__songInfo__artist__name}>
                {artist}
                <Show
                  when={
                    props.artist.length > 1 &&
                    artist !== props.artist[props.artist.length - 1]
                  }
                >
                  <span
                    class={styles.mediaTileGlass__songInfo__artist__separator}
                  >
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
