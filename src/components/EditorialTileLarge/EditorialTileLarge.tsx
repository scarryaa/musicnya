import { A } from '@solidjs/router';
import styles from './EditorialTileLarge.module.scss';
import { createMemo } from 'solid-js';
import { extractTileId } from '../../util/utils';

export interface EditorialTileLargeProps {
  mediaArt: MusicKit.Artwork
  badge: string
  title: string
  subtitle: string
  type: MusicKit.MediaItemType
  contentType: string
  id: string
  link: string
}

export function EditorialTileLarge(props: EditorialTileLargeProps) {
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
      if (props.contentType) {
        return `/${props.contentType?.substring(
          0,
          props.contentType.length - 1
        )}/${newId}`;
      } else {
        return `/multiplex/${newId}`;
      }
    } else {
      return '#';
    }
  });

  return (
    <div class={styles.editorialTileLarge}>
      <div class={styles.editorialTileLarge__mediaInfo}>
        <div class={styles.editorialTileLarge__mediaInfo__badge}>
          {props.badge}
        </div>
        <div class={styles.editorialTileLarge__mediaInfo__title}>
          {props.title}
        </div>
        <div class={styles.editorialTileLarge__mediaInfo__subtitle}>
          {props.subtitle}
        </div>
      </div>
      <A class={styles.editorialTileLarge__overlay} href={constructLink()}>
        <div class={styles.editorialTileLarge__overlay__inner} />
        <img
          loading="lazy"
          decoding="async"
          class={styles.editorialTileLarge__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={300}
          height={150}
        />
      </A>
    </div>
  );
}
