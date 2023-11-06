/* eslint-disable multiline-ternary */
import { For, createResource, type JSX } from "solid-js";
import styles from "./Songs.module.scss";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../../components/Error/Error";
import { getLibrary } from "../../../util/firebase";
import { A } from "@solidjs/router";
import { IoEllipsisHorizontal, IoPause, IoPlay } from "solid-icons/io";
import { currentMediaItem, isPlaying } from "../../../stores/store";

export function Songs(): JSX.Element {
  const [userLibrary] = createResource(async () => await getLibrary());

  return (
    <div class={styles.songs}>
      <div class={styles.songs__header}>
        <div class={styles.songs__header__play}></div>
        <div class={styles.songs__header__title}>Title</div>
        <div class={styles.songs__header__artist}>Artist</div>
        <div class={styles.songs__header__album}>Album</div>
        <div class={styles.songs__header__duration}>Duration</div>
        <div class={styles.songs__header__dateAdded}></div>
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
              <div
                class={styles.songs__body__song}
                onDblClick={async () => {
                  await MusicKit.getInstance().setQueue({
                    songs: [song.id],
                    startPlaying: true
                  });
                }}
              >
                <div class={styles.songs__body__song__artwork_wrapper}>
                  <img
                    class={styles.songs__body__song__artwork}
                    src={song.mediaArt
                      .replace("{w}x{h}", "30x30")
                      .replace("{f}", "png")}
                  />
                  <div
                    class={`${styles.songs__body__song__play} ${
                      song.id === currentMediaItem.id ? styles.visible : ""
                    }`}
                  >
                    {isPlaying.value && song.id === currentMediaItem.id ? (
                      <IoPause
                        onClick={async () => {
                          await MusicKit.getInstance().pause();
                        }}
                        size={20}
                        fill={
                          song.id === currentMediaItem.id
                            ? "var(--accent)"
                            : "var(--text)"
                        }
                      />
                    ) : (
                      <IoPlay
                        onClick={async () => {
                          song.id === currentMediaItem.id
                            ? await MusicKit.getInstance().play()
                            : await MusicKit.getInstance().setQueue({
                                songs: [song.id],
                                startPlaying: true
                              });
                        }}
                        size={20}
                        fill={
                          song.id === currentMediaItem.id
                            ? "var(--accent)"
                            : "var(--text)"
                        }
                      />
                    )}
                  </div>
                </div>
                <div class={styles.songs__body__song__title}>{song.title}</div>
                <div>
                  <A
                    class={styles.songs__body__song__artist}
                    href={`/artist/${song.artistCatalogId}`}
                  >
                    {song.artist}
                  </A>
                </div>
                <div>
                  <A
                    class={styles.songs__body__song__album}
                    href={`/album/${song.albumCatalogId}`}
                  >
                    {song.album}
                  </A>
                </div>
                <div class={styles.songs__body__song__duration}>
                  {song.duration}
                </div>
                <div class={styles.songs__body__song__more}>
                  <IoEllipsisHorizontal size={20} fill="var(--accent)" />
                </div>
              </div>
            )}
          </For>
        )}
      </div>
    </div>
  );
}
