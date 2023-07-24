import styles from "./MediaDetail.module.scss";
import { MediaTileNoControls } from "../MediaTileNoControls/MediaTileNoControls";
import { IoPlay, IoShuffle } from "solid-icons/io";
import { ButtonPrimary } from "../ButtonPrimary/ButtonPrimary";

export type MediaDetailProps = {
  title: string;
  subtitle: string;
  description: string;
  mediaArt: MusicKit.Artwork;
  artistIds: string[];
  artists: string[];
  id: string;
  type: MusicKit.MediaItemType;
};

export function MediaDetail(props: MediaDetailProps) {
  return (
    <div class={styles.mediaDetail}>
      <MediaTileNoControls
        type={props.type}
        mediaArt={props.mediaArt}
        title={props.title}
        artistIds={props.artistIds}
        artists={props.artists}
        id={props.id}
      />
      <div class={styles.mediaDetail__details}>
        <div class={styles.mediaDetail__details__title}>{props.title}</div>
        <div class={styles.mediaDetail__details__subtitle}>
          {props.subtitle}
        </div>
        <div class={styles.mediaDetail__details__description}>
          {props.description}
        </div>
        <div class={styles.mediaDetail__details__actions}>
          <ButtonPrimary
            icon={IoPlay}
            label="Play"
            onClick={() => {
              console.log("Play");
            }}
          />
          <ButtonPrimary
            icon={IoShuffle}
            label="Shuffle"
            onClick={() => {
              console.log("Shuffle");
            }}
          />
        </div>
      </div>
    </div>
  );
}
