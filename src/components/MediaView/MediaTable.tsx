import { For, Show } from "solid-js";
import styles from "./MediaTable.module.scss";
import { formatTime, getAlbumIdFromUrl, replaceSrc } from "../../util/utils";
import { A } from "@solidjs/router";

export type MediaTableProps = {
  items: MusicKit.MediaItem[];
  class: string;
  showArt: boolean;
};

export function MediaTable(props: MediaTableProps) {
  return (
    <div class={styles.mediaTable + " " + props.class}>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <Show when={props.showArt}>
              <th>Album</th>
            </Show>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.items}>
            {(item, i) => (
              <tr>
                <td>{i() + 1}</td>
                <td class={styles.mediaTable__title__container}>
                  <Show when={props.showArt}>
                    <img
                      loading="lazy"
                      decoding="async"
                      class={styles.mediaTable__title__container__image}
                      src={replaceSrc(item.attributes?.artwork?.url, 40)}
                      alt="Album Art"
                      width={40}
                      height={40}
                    />
                  </Show>
                  <div class={styles.mediaTable__title__container__info}>
                    <div
                      class={styles.mediaTable__title__container__info__title}
                      title={item.attributes?.name}
                    >
                      {item.attributes?.name}
                    </div>
                    <div
                      class={styles.mediaTable__title__container__info__artist}
                    >
                      <For each={item.relationships?.artists?.data}>
                        {(relationship, i) => (
                          <A
                            title={relationship.attributes?.name}
                            href={`/artist/${item.id}`}
                          >
                            {relationship.attributes?.name}
                            {i() + 1 !==
                              item.relationships?.artists?.data.length && ", "}
                          </A>
                        )}
                      </For>
                    </div>
                  </div>
                </td>
                <Show when={props.showArt}>
                  <td>
                    <A
                      title={item.attributes?.albumName}
                      class={styles.mediaTable__album}
                      href={`/album/${getAlbumIdFromUrl(item.attributes?.url)}`}
                    >
                      {item.attributes?.albumName}
                    </A>
                  </td>
                </Show>
                <td class={styles.mediaTable__duration}>
                  {formatTime(item.attributes?.durationInMillis / 1000)}
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
