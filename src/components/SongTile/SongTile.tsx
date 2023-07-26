import { IoPlay } from "solid-icons/io";
import styles from "./SongTile.module.scss";

export type SongTileProps = {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
};

export function SongTile(props: SongTileProps) {
  return (
    <div class={styles.songTile}>
      <div class={styles.songTile__overlay}>
        <div class={styles.songTile__overlay__inner}>
          <IoPlay
            size={30}
            class={styles.songTile__overlay__inner__button}
            onclick={async () => {
              await MusicKit.getInstance().setQueue({
                [props.type.substring(0, props.type.length - 1)]: props.id,
                startPlaying: true,
              });
            }}
          />
        </div>
        <img
          loading="lazy"
          decoding="async"
          class={styles.songTile__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={150}
          height={150}
        />
      </div>
      <div class={styles.songTile__mediaInfo}>
        <div class={styles.songTile__mediaInfo__title}>{props.title}</div>
        <div class={styles.songTile__mediaInfo__artist}>
          {props.artists?.[0]}
        </div>
      </div>
    </div>
  );
}
