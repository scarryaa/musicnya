import { JSX } from "solid-js";
import styles from "./EditorialTile.module.scss";
import { IoEllipsisVertical, IoPlay } from "solid-icons/io";

export type EditorialTileProps = {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
};
export function EditorialTile(props: EditorialTileProps) {
  return (
    <div class={styles.editorialTile}>
      <div class={styles.editorialTile__overlay}>
        <div class={styles.editorialTile__overlay__inner}>
          <IoEllipsisVertical
            size={26}
            class={styles.editorialTile__overlay__inner__button__more}
          />
        </div>
        <img
          loading="lazy"
          decoding="async"
          class={styles.editorialTile__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={300}
          height={150}
        />
      </div>
      <div class={styles.editorialTile__mediaInfo}>
        <div class={styles.editorialTile__mediaInfo__title}>{props.title}</div>
      </div>
    </div>
  );
}
