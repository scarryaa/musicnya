import { IoEllipsisVertical, IoPlay } from "solid-icons/io";
import styles from "./MediaTileLarge.module.scss";
import { A } from "@solidjs/router";

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
        <A
          class={styles.mediaTileLarge__overlay__inner}
          href={`/${props.type.substring(0, props.type.length - 1)}/${
            props.id
          }`}
        >
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTileLarge__overlay__inner__button__more}
          />
        </A>
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
