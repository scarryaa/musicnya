import { useParams } from "@solidjs/router";
import styles from "./Playlist.module.scss";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import {
  getNestedArtwork,
  getNestedAttributes,
  getNestedData,
  getNestedRelationships,
  replaceSrc
} from "../../util/utils";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { MediaTable } from "../../components/MediaView/MediaTable";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { createPlaylistStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

export function Playlist() {
  const params = useParams<{ id: string }>();

  const playlistStore = createPlaylistStore();
  const playlistData = playlistStore(params);

  const playlist = createSignal(playlistData()?.data[0]);

  // scroll to top on params change
  createEffect(() => {
    (playlistPage.scrollTop = 0), params.id;
  });

  // eslint-disable-next-line prefer-const
  let playlistPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.playlist} ref={playlistPage}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            playlistData.state === "pending" ||
            playlistData.state === "unresolved" ||
            playlistData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={playlistData.state === "errored"}>
          <Error error={playlistData.error} />
        </Match>
        <Match when={playlistData.state === "ready"}>
          <Show when={playlist}>
            <MediaDetail
              type="playlists"
              title={getNestedAttributes(playlistData())?.name}
              mediaArt={
                (getNestedArtwork(playlistData()) && {
                  url:
                    replaceSrc(getNestedArtwork(playlistData())?.url, 300) || ""
                }) ||
                (getNestedRelationships(playlistData())?.tracks?.data?.[0]
                  ?.attributes?.artwork && {
                  url:
                    replaceSrc(
                      getNestedRelationships(playlistData())?.tracks?.data?.[0]
                        ?.attributes?.artwork?.url,
                      300
                    ) || ""
                })
              }
              subtitle={
                getNestedRelationships(playlistData())?.catalog?.data?.[0]
                  ?.attributes?.curatorName
              }
              description={
                getNestedAttributes(playlistData())?.description?.standard
              }
              id={getNestedData(playlistData()).id}
              artistIds={getNestedAttributes(playlistData())?.curatorName}
              artists={getNestedAttributes(playlistData())?.curatorName}
            />
            <MediaTable
              type="playlists"
              id={getNestedData(playlistData())?.id}
              showArt={true}
              items={getNestedRelationships(playlistData())?.tracks?.data}
              class={styles.playlist__table}
            />
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
