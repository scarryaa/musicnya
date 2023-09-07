import { IoPlay } from "solid-icons/io";
import styles from "./ArtistTableTile.module.scss";
import { A } from "@solidjs/router";

export type ArtistTableTileProps = {
  title: string;
  mediaArt: MusicKit.Artwork;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
  onClick?: () => void;
};

export function ArtistTableTile(props: ArtistTableTileProps) {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  }
  return (
    <div class={styles.artistTableTile} onClick={handleClick}>
    <img
        loading="lazy"
        decoding="async"
        class={styles.artistTableTile__image}
        src={props.mediaArt.url || ""}
        width={300}
        height={150}
    />
      <div class={styles.artistTableTile__mediaInfo}>
        <span
          class={styles.artistTableTile__mediaInfo__name}
        >
          {props.title}
        </span>
      </div>
    </div>
  );
}
