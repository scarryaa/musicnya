import { useParams } from "@solidjs/router";
import styles from "./Artist.module.scss";

export function Artist() {
  const params = useParams<{ id: string }>();

  console.log(params.id);
  return <div class={styles.artist}>{params.id}</div>;
}
