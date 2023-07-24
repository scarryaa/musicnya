import { useParams } from "@solidjs/router";
import styles from "./Playlist.module.scss";

export function Playlist() {
  const params = useParams<{ id: string }>();

  console.log(params.id);
  return <div class={styles.playlist}>{params.id}</div>;
}
