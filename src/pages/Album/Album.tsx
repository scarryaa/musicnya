import { useParams } from "@solidjs/router";
import styles from "./Album.module.scss";

export function Album() {
  const params = useParams<{ id: string }>();

  console.log(params.id);
  return <div class={styles.album}>{params.id}</div>;
}
