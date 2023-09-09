import styles from './MediaTileNoControls.module.scss';
import musicNote from '../../assets/music_note.png';

export interface MediaTileNoControlsProps {
  mediaArt: MusicKit.Artwork
  title: string
  artists: string[]
  type: MusicKit.MediaItemType
  id: string
  artistIds: string[]
}

export function MediaTileNoControls(props: MediaTileNoControlsProps) {
  return (
    <div class={styles.mediaTileNoControls}>
      <div class={styles.mediaTileNoControls__overlay}>
        <img
          loading="lazy"
          decoding="async"
          class={styles.mediaTileNoControls__image}
          src={props.mediaArt?.url || musicNote}
          alt="Album Art"
          width={300}
          height={300}
        />
      </div>
    </div>
  );
}
