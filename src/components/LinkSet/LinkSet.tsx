import { For } from 'solid-js';
import styles from './LinkSet.module.scss';
import { LinkTile } from '../LinkTile/LinkTile';

export interface LinkSetProps {
  links: Array<{
    label: string
    url: string
  }>
}

export function LinkSet(props: LinkSetProps) {
  return (
    <div class={styles.linkSet}>
      <For each={props.links}>
        {(item) => <LinkTile title={item.label} url={item.url} />}
      </For>
    </div>
  );
}
