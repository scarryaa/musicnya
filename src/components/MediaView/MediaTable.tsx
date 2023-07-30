import { For, Show } from "solid-js";
import styles from "./MediaTable.module.scss";
import {
  formatTime,
  getAlbumIdFromUrl,
  getItemAttributes,
  getItemRelationships,
  replaceSrc,
} from "../../util/utils";
import { A, Navigate, useNavigate } from "@solidjs/router";
import { IoEllipsisHorizontal, IoPause, IoPlay } from "solid-icons/io";
import { currentMediaItem, isPlaying, setIsShuffle } from "../../stores/store";
import { pause, play, setQueue, setShuffleMode } from "../../api/musickit";
import { fetchSearchResults } from "../../api/search";

export type MediaTableProps = {
  items: MusicKit.MediaItem[];
  class: string;
  showArt: boolean;
  id: string;
  type: MusicKit.MediaItemType;
};

const idEqualsCurrentMediaItem = (id: string) =>
  currentMediaItem.id === id && isPlaying.value;

export function MediaTable(props: MediaTableProps) {
  const navigate = useNavigate();

  const getArtistId = async (artist: string) => {
    const id = await fetchSearchResults({
      devToken: MusicKit.getInstance().developerToken,
      musicUserToken: MusicKit.getInstance().musicUserToken,
      term: artist,
    }).then(
      (res) =>
        res.results.suggestions?.filter((s) => s.content?.type === "artists")[0]
          ?.content.id,
    );

    return id;
  };

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
              <tr
                ondblclick={() => setQueue(props.type, [props.id], true, i())}
              >
                <td class={styles.mediaTable__number}>{i() + 1}</td>
                {currentMediaItem.id === item.id && isPlaying.value ? (
                  <IoPause
                    role="button"
                    size={24}
                    class={styles.mediaTable__play}
                    fill="var(--text)"
                    style={{
                      "margin-top": "1rem",
                      fill: idEqualsCurrentMediaItem(item.id)
                        ? "var(--accent)"
                        : "var(--text)",
                    }}
                    onclick={async (e) => {
                      e.preventDefault();
                      pause();
                    }}
                  />
                ) : (
                  <IoPlay
                    role="button"
                    size={24}
                    class={styles.mediaTable__play}
                    fill="var(--text)"
                    style={{
                      "margin-top": "1rem",
                      fill: idEqualsCurrentMediaItem(item.id)
                        ? "var(--accent)"
                        : "var(--text)",
                    }}
                    onclick={async (e) => {
                      e.preventDefault();
                      setShuffleMode(0);
                      setIsShuffle({ value: 0 });

                      idEqualsCurrentMediaItem(item.id)
                        ? await play().catch((e) => console.log(e))
                        : setQueue(
                            props.type
                              .substring(0, props.type.length - 1)
                              .replace("library-", ""),
                            props.id,
                            true,
                            i(),
                          );
                    }}
                  />
                )}
                <td class={styles.mediaTable__title__container}>
                  <Show when={props.showArt}>
                    <img
                      loading="lazy"
                      decoding="async"
                      class={styles.mediaTable__title__container__image}
                      src={replaceSrc(getItemAttributes(item).artwork?.url, 40)}
                      alt="Album Art"
                      width={40}
                      height={40}
                    />
                  </Show>
                  <div class={styles.mediaTable__title__container__info}>
                    <div
                      class={styles.mediaTable__title__container__info__title}
                      title={getItemAttributes(item)?.name}
                      style={{
                        color:
                          currentMediaItem.id === item.id
                            ? "var(--accent)"
                            : "var(--text)",
                      }}
                    >
                      {getItemAttributes(item)?.name}
                    </div>
                    <div
                      classList={{
                        [styles.mediaTable__title__container__info__artist]:
                          true,
                      }}
                    >
                      <For
                        each={
                          getItemRelationships(item)?.artists?.data || [
                            getItemAttributes(item)?.artistName,
                          ]
                        }
                      >
                        {(relationship, i) => (
                          <A
                            title={
                              getItemRelationships(relationship)?.name ||
                              getItemAttributes(item)?.artistName
                            }
                            href={
                              relationship.id
                                ? `/artist/${relationship.id}`
                                : `#`
                            }
                            onclick={async (e) => {
                              e.preventDefault();
                              const id = await getArtistId(
                                getItemRelationships(relationship)?.name ||
                                  getItemAttributes(item)?.artistName.replace(
                                    "&",
                                    "and",
                                  ),
                              );

                              navigate(`/artist/${id}`, { replace: true });
                            }}
                          >
                            {getItemAttributes(relationship)?.name ||
                              getItemAttributes(item)?.artistName}
                            {i() + 1 !==
                              getItemRelationships(item)?.artists?.data ||
                              ([getItemAttributes(item)?.artistName].length &&
                                ", ")}
                          </A>
                        )}
                      </For>
                    </div>
                  </div>
                </td>
                <Show when={props.showArt}>
                  <td>
                    <A
                      title={getItemAttributes(item)?.albumName}
                      class={styles.mediaTable__album}
                      href={`/album/${getAlbumIdFromUrl(item.attributes?.url)}`}
                    >
                      {getItemAttributes(item)?.albumName}
                    </A>
                  </td>
                </Show>
                <td class={styles.mediaTable__duration}>
                  {formatTime(getItemAttributes(item)?.durationInMillis / 1000)}
                  <IoEllipsisHorizontal
                    role="button"
                    size={24}
                    class={styles.mediaTable__more}
                    fill="var(--text)"
                    onclick={(e) => {
                      e.preventDefault();
                      console.log("more");
                    }}
                  />
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
