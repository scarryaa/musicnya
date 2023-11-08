import { JSX } from "solid-js";
import styles from "./NewPlaylistTile.module.scss";

interface NewPlaylistTileProps {
  onclick: () => void;
}

export function NewPlaylistTile(props: NewPlaylistTileProps): JSX.Element {
  return (
    <div class={styles.newPlaylistTile} onClick={props.onclick}>
      <div class={styles.inlay}>
        <div>
          <div class={styles.plus}>+</div>
          <div class={styles.text}>New Playlist</div>
        </div>
      </div>
    </div>
  );
}
