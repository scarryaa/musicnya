import { IoPlay } from 'solid-icons/io';
import styles from './ArtistTile.module.scss';
import { A } from '@solidjs/router';

export interface ArtistTileProps {
  title: string
  mediaArt: MusicKit.Artwork
  artists: string[]
  type: MusicKit.MediaItemType
  id: string
}

export function ArtistTile(props: ArtistTileProps) {
  return (
    <div class={styles.artistTile}>
      <A class={styles.artistTile__overlay} href={`/artist/${props.id}`}>
        <div class={styles.artistTile__overlay__inner}>
          <IoPlay
            size={40}
            class={styles.artistTile__overlay__inner__button}
            onclick={async () => {
              await MusicKit.getInstance().setQueue({
                [props.type.substring(0, props.type.length - 1)]: props.id,
                startPlaying: true
              });
            }}
          />
        </div>

        <img
          loading="lazy"
          decoding="async"
          class={styles.artistTile__image}
          src={props.mediaArt.url || ''}
          width={300}
          height={150}
        />
      </A>
      <div class={styles.artistTile__mediaInfo}>
        <A
          class={styles.artistTile__mediaInfo__name}
          href={`/artist/${props.id}`}
        >
          {props.title}
        </A>
      </div>
    </div>
  );
}
