import { For, Match, Switch } from "solid-js";
import { createLibraryAlbumsStore } from "../../../stores/api-store";
import styles from "./Albums.module.scss";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../../components/Error/Error";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import {
  getItemAttributes,
  getNestedRelationships,
  replaceSrc,
} from "../../../util/utils";

export function Albums() {
  const albumsStore = createLibraryAlbumsStore();
  const albumsData = albumsStore();

  return (
    <div class={styles.albums}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            albumsData.state === "pending" ||
            albumsData.state === "unresolved" ||
            albumsData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={albumsData.state === "errored"}>
          <Error error={albumsData.error} />
        </Match>
        <Match when={albumsData.state === "ready"}>
          <For each={albumsData()?.data}>
            {(album) => (
              <MediaTile
                id={album.id}
                type={album.type}
                title={album.attributes.name}
                artists={getNestedRelationships(album)?.artists?.data?.map(
                  (artist: any) => artist.attributes.name,
                )}
                artistIds={getNestedRelationships(album)?.artists?.data?.map(
                  (artist: any) => artist.id,
                )}
                mediaArt={
                  getItemAttributes(album).artwork && {
                    url: replaceSrc(getItemAttributes(album).artwork.url, 300),
                  }
                }
              />
            )}
          </For>
        </Match>
      </Switch>
    </div>
  );
}
