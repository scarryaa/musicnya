/* eslint-disable multiline-ternary */
import { For, type JSX } from "solid-js";
import styles from "./Songs.module.scss";
import { createLibrarySongsStore } from "../../../stores/api-store";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../../components/Error/Error";
import { getItemAttributes } from "../../../util/utils";

export function Songs(): JSX.Element {
  const songsStore = createLibrarySongsStore();
  const songsData = songsStore();

  return (
    <div class={styles.songs}>
      <div class={styles.songs__body}>
        <table class={styles.songs__table}>
          <thead class={styles.songs__table__header}>
            <tr class={styles.songs__table__header__row}>
              <th class={styles.songs__table__index}>#</th>
              <th class={styles.songs__table__title}>title</th>
              <th class={styles.songs__table__artist}>artist</th>
              <th class={styles.songs__table__album}>album</th>
              <th class={styles.songs__table__time}>time</th>
            </tr>
          </thead>
          <tbody>
            {songsData.state === "pending" ||
            songsData.state === "unresolved" ||
            songsData.state === "refreshing" ? (
              <tr>
                <td>
                  <div class={styles.songs__table__loading}>
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : songsData.state === "errored" ? (
              <tr>
                <td>
                  <Error
                    message={
                      songsData.error?.message ??
                      "An error occured while fetching your songs."
                    }
                  />
                </td>
              </tr>
            ) : (
              <For each={songsData().data} fallback={<LoadingSpinner />}>
                {(song, i) => (
                  <tr>
                    <td class={styles.songs__table__index}>{i() + 1}</td>
                    <td class={styles.songs__table__title}>
                      <div>{getItemAttributes(song).name}</div>
                    </td>
                    <td class={styles.songs__table__artist}>
                      <div>{getItemAttributes(song).artistName}</div>
                    </td>
                    <td class={styles.songs__table__album}>
                      <div>{getItemAttributes(song).albumName}</div>
                    </td>
                    <td class={styles.songs__table__time}>
                      <div>
                        {new Date(getItemAttributes(song).durationInMillis)
                          .toISOString()
                          .substr(15, 4)}
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
