import { IoEllipsisVertical, IoPlay } from "solid-icons/io";
import styles from "./MediaTileLarge.module.scss";

export type MediaTileLargeProps = {
  class?: string;
  title?: string;
  type: MusicKit.MediaItemType;
  id: string;
  mediaArt: MusicKit.Artwork;
};

export function MediaTileLarge(props: MediaTileLargeProps) {
  return (
    <div class={styles.mediaTileLarge}>
      <div class={styles.mediaTileLarge__mediaInfo}>
        <h2 class={styles.mediaTileLarge__mediaInfo__title}>{props.title}</h2>
      </div>
      <div class={styles.mediaTileLarge__overlay}>
        <div class={styles.mediaTileLarge__overlay__inner}>
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTileLarge__overlay__inner__button__more}
          />
        </div>
        <img
          style={{ "background-color": `#${props.mediaArt.bgColor}` }}
          loading="lazy"
          decoding="async"
          class={styles.mediaTileLarge__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
}
