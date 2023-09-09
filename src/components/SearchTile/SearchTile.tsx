import { A } from '@solidjs/router';
import styles from './SearchTile.module.scss';
import { createMemo } from 'solid-js';
import { extractTileId } from '../../util/utils';

export interface SearchTileProps {
  mediaArt: MusicKit.Artwork
  title: string
  artists: string[]
  type: MusicKit.MediaItemType
  id: string
  link: string
}

export function SearchTile(props: SearchTileProps) {
  const constructLink = createMemo(() => {
    const newId = extractTileId(props.link, props.id);

    if (props.link && props.link.includes('viewMultiRoom')) {
      return `/multiroom/${newId}`;
    } else if (
      (props.link && props.link.includes('pp=')) ||
      props.link.includes('curator')
    ) {
      return `/curator/${newId}`;
    } else if (props.link && props.link.includes('station')) {
      return `/station/${newId}`;
    } else if (props.link) {
      return `/multiplex/${newId}`;
    } else {
      return '#';
    }
  });

  return (
    <div class={styles.searchTile}>
      <div class={styles.searchTile__overlay}>
        <A class={styles.searchTile__overlay__inner} href={constructLink()} />
        <img
          loading="lazy"
          decoding="async"
          class={styles.searchTile__image}
          src={props.mediaArt?.url}
          alt="Album Art"
          width={300}
          height={150}
        />
      </div>
      <div class={styles.searchTile__mediaInfo}>
        <div class={styles.searchTile__mediaInfo__title}>
          {props.title?.replace('Apple Music ', '').replace('Apple ', '')}
        </div>
      </div>
    </div>
  );
}
