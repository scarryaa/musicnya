import styles from "./VideoTile.module.scss";
import { IoEllipsisVertical, IoPlay } from "solid-icons/io";

export type VideoTileProps = {
  mediaArt: MusicKit.Artwork;
  title: string;
  artist: string[];
  type: MusicKit.MediaItemType;
  id: string;
};
export function VideoTile(props: VideoTileProps) {
  return (
    <div class={styles.videoTile}>
      <div class={styles.videoTile__overlay}>
        <div class={styles.videoTile__overlay__inner}>
          <IoPlay
            size={40}
            class={styles.videoTile__overlay__inner__button}
            onclick={async () => {
              console.log(props.id);
              console.log(props.type);
              await MusicKit.getInstance().setQueue({
                [props.type.substring(0, props.type.length - 1)]: props.id,
                startPlaying: true,
              });
            }}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.videoTile__overlay__inner__button__more}
          />
        </div>
        <img
          loading="lazy"
          decoding="async"
          class={styles.videoTile__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={300}
          height={150}
        />
      </div>
      <div class={styles.videoTile__mediaInfo}>
        <div class={styles.videoTile__mediaInfo__title}>{props.title}</div>
      </div>
    </div>
  );
}
