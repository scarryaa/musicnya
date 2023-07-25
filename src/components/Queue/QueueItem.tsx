import { formatTime } from "../../util/utils";
import styles from "./QueueItem.module.scss";

export type QueueItemProps = {
  title?: string;
  type: MusicKit.MediaItemType;
  id: string;
  mediaArt: MusicKit.Artwork;
  artist?: string;
  album?: string;
  duration?: number;
  index: number;
  isCurrentItem: boolean;
};

export function QueueItem(props: QueueItemProps) {
  console.log(props);

  return (
    <div
      class={styles.queueItem}
      ondblclick={() => {
        MusicKit.getInstance().changeToMediaItem(props.id);
      }}
    >
      <div class={styles.queueItem__image}>
        <img
          loading="lazy"
          decoding="async"
          src={props.mediaArt.url}
          alt="Album Art"
          width={50}
          height={50}
        />
      </div>
      <div class={styles.queueItem__info}>
        <div class={styles.queueItem__info__title} title={props.title}>
          {props.title}
        </div>
        <div class={styles.queueItem__info__artist} title={props.artist}>
          {props.artist}
        </div>
      </div>
      <div class={styles.queueItem__duration}>
        {props.duration ? formatTime(props.duration / 1000) : ""}
      </div>
    </div>
  );
}
