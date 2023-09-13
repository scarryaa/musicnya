/* eslint-disable multiline-ternary */
import { For, createResource, type JSX } from "solid-js";
import styles from "./Songs.module.scss";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../../components/Error/Error";
import { getLibrary } from "../../../util/firebase";
import { A } from "@solidjs/router";

export function Songs(): JSX.Element {
  const [userLibrary] = createResource(async () => await getLibrary());

  return (
    <div class={styles.songs}>
      <div class={styles.songs__header}>
        <div class={styles.songs__header__title}>Title</div>
        <div class={styles.songs__header__artist}>Artist</div>
        <div class={styles.songs__header__album}>Album</div>
        <div class={styles.songs__header__duration}>Duration</div>
      </div>
      <div class={styles.songs__body}>
        {userLibrary.state === "pending" ||
        userLibrary.state === "unresolved" ||
        userLibrary.state === "refreshing" ? (
          <LoadingSpinner />
        ) : userLibrary.state === "errored" ? (
          <Error error={userLibrary.error} />
        ) : (
          <For each={userLibrary()?.songs}>
            {(song) => (
              <div class={styles.songs__body__song}>
                <div class={styles.songs__body__song__title}>{song.title}</div>
                <div>
                  <A
                    class={styles.songs__body__song__artist}
                    href={`/library/artists/${song.artistId}`}
                  >
                    {song.artist}
                  </A>
                </div>
                <div>
                  <A
                    class={styles.songs__body__song__album}
                    href={`/library/albums/${song.albumId}`}
                  >
                    {song.album}
                  </A>
                </div>
                <div class={styles.songs__body__song__duration}>
                  {song.duration}
                </div>
              </div>
            )}
          </For>
        )}
      </div>
    </div>
  );
}
