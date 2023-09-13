/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch, Match, For } from "solid-js";
import type { JSX } from "solid-js";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { createLibraryPlaylistStore } from "../../../stores/api-store";
import {
  getNestedRelationships,
  getItemAttributes,
  replaceSrc,
  getItemRelationships
} from "../../../util/utils";
import { Error } from "../../../components/Error/Error";
import styles from "./Playlists.module.scss";

export function Playlists(): JSX.Element {
  const playlistsStore = createLibraryPlaylistStore();
  const playlistsData = playlistsStore();

  return (
    <div class={styles.playlists}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            playlistsData.state === "pending" ||
            playlistsData.state === "unresolved" ||
            playlistsData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={playlistsData.state === "errored"}>
          <Error error={playlistsData.error} />
        </Match>
        <Match when={playlistsData.state === "ready"}>
          <For each={playlistsData()?.data}>
            {(playlist) => (
              <MediaTile
                id={playlist.id}
                type={playlist.type}
                title={playlist.attributes.name}
                artists={getNestedRelationships(playlist)?.artists?.data?.map(
                  (artist: any) => artist.attributes.name
                )}
                artistIds={getNestedRelationships(playlist)?.artists?.data?.map(
                  (artist: any) => artist.id
                )}
                mediaArt={
                  (getItemAttributes(playlist).artwork && {
                    url: replaceSrc(
                      getItemAttributes(playlist).artwork.url,
                      300
                    )
                  }) ||
                  (getItemRelationships(playlist)?.tracks?.data?.[0]?.attributes
                    ?.artwork && {
                    url: replaceSrc(
                      getItemRelationships(playlist)?.tracks?.data?.[0]
                        ?.attributes?.artwork.url,
                      300
                    )
                  }) ||
                  (playlist.songs?.[0]?.attributes?.artwork && {
                    url: replaceSrc(
                      playlist.songs?.[0]?.attributes?.artwork.url,
                      300
                    )
                  })
                }
              />
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
}
