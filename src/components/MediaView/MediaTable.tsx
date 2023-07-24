import { For } from "solid-js";
import styles from "./MediaTable.module.scss";
import { formatTime, replaceSrc } from "../../util/utils";

export type MediaTableProps = {
  items: MusicKit.MediaItem[];
  class: string;
};

export function MediaTable(props: MediaTableProps) {
  return (
    <div class={styles.mediaTable + " " + props.class}>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.items}>
            {(item, i) => (
              <tr>
                <td>{i() + 1}</td>
                <td class={styles.mediaTable__title__container}>
                  <img
                    loading="lazy"
                    decoding="async"
                    class={styles.mediaTable__title__container__image}
                    src={replaceSrc(item.attributes?.artwork?.url, 40)}
                    alt="Album Art"
                    width={40}
                    height={40}
                  />
                  <div class={styles.mediaTable__title__container__info}>
                    <div
                      class={styles.mediaTable__title__container__info__title}
                    >
                      {item.attributes?.name}
                    </div>
                    <div
                      class={styles.mediaTable__title__container__info__artist}
                    >
                      {item.attributes?.artistName}
                    </div>
                  </div>
                </td>
                <td>
                  <span class={styles.mediaTable__album}>
                    {item.attributes?.name}
                  </span>
                </td>
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
