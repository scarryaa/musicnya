import styles from './VideoTile.module.scss';
import { IoEllipsisVertical, IoPlay } from 'solid-icons/io';

export interface VideoTileProps {
  mediaArt: MusicKit.Artwork
  title: string
  artists: string[]
  type: MusicKit.MediaItemType
  id: string
}
export function VideoTile(props: VideoTileProps) {
  return (
    <div class={styles.videoTile}>
      <div class={styles.videoTile__overlay}>
        <div class={styles.videoTile__overlay__inner}>
          <IoPlay
            size={40}
            class={styles.videoTile__overlay__inner__button}
            onclick={async () => {
              await MusicKit.getInstance().setQueue({
                musicVideo: props.id,
                startPlaying: true
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
