import { JSX, createMemo } from 'solid-js';
import styles from './EditorialTile.module.scss';
import { IoEllipsisVertical, IoPlay } from 'solid-icons/io';
import { A } from '@solidjs/router';
import { extractTileId } from '../../util/utils';

export interface EditorialTileProps {
  mediaArt: MusicKit.Artwork
  title: string
  artists: string[]
  type: MusicKit.MediaItemType
  id: string
  link: string
  editorialElementKind: string
}

export function EditorialTile(props: EditorialTileProps) {
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
    <div class={styles.editorialTile}>
      <div class={styles.editorialTile__overlay}>
        <A class={styles.editorialTile__overlay__inner} href={constructLink()}>
          <IoEllipsisVertical
            size={26}
            class={styles.editorialTile__overlay__inner__button__more}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.editorialTile__image}
          src={props.mediaArt?.url}
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
