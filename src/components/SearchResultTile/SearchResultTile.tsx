import { Match, Switch } from 'solid-js';
import styles from './SearchResultTile.module.scss';
import { A } from '@solidjs/router';

export interface SearchResultTileProps {
  mediaArt: MusicKit.Artwork
  title: string
  artist: string
  type: MusicKit.MediaItemType
  id: string
  link: string
  kind: 'topResults' | 'terms'
}

export function SearchResultTile(props: SearchResultTileProps) {
  return (
    <Switch>
      <Match when={props.kind === 'topResults'}>
        <A class={styles.searchResultTile} href={props.link}>
          <img
            loading="lazy"
            decoding="async"
            class={styles.searchResultTile__image}
            src={props.mediaArt?.url}
            alt="Album Art"
            style={{
              'border-radius':
                props.type === 'artists' ? '50%' : 'var(--border-radius)'
            }}
          />
          <div class={styles.searchResultTile__mediaInfo}>
            <div class={styles.searchResultTile__mediaInfo__title}>
              {props.title}
            </div>
            <div class={styles.searchResultTile__mediaInfo__artist}>
              {props.artist}
            </div>
            <div class={styles.searchResultTile__mediaInfo__type}>
              {props.type.substring(0, props.type.length - 1)}
            </div>
          </div>
        </A>
      </Match>
      <Match when={props.kind === 'terms'}>
        <A class={styles.searchResultTile} href={props.link}>
          <div class={styles.searchResultTile__mediaInfo}>
            <div class={styles.searchResultTile__mediaInfo__title}>
              {props.title}
            </div>
          </div>
        </A>
      </Match>
    </Switch>
  );
}
