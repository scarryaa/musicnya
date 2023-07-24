import { useParams } from "@solidjs/router";
import styles from "./Album.module.scss";
import { createResource } from "solid-js";
import { fetchAlbum } from "../../api/album";

export function Album() {
  const params = useParams<{ id: string }>();
  const [data] = createResource<
    any,
    {
      devToken: string;
      musicUserToken: string;
      id: string;
    },
    string
  >(
    {
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
      id: params.id,
    },
    fetchAlbum,
  );

  console.log(data());
  return <div class={styles.album}>{params.id}</div>;
}
