/* eslint-disable @typescript-eslint/no-explicit-any */
import { For, Match, Switch, createResource } from "solid-js";
import styles from "./Albums.module.scss";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../../components/Error/Error";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { replaceSrc } from "../../../util/utils";
import type { JSX } from "solid-js";
import { getLibrary } from "../../../util/firebase";

export function Albums(): JSX.Element {
  const [userLibrary] = createResource(async () => await getLibrary());

  return (
    <div class={styles.albums}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            userLibrary.state === "pending" ||
            userLibrary.state === "unresolved" ||
            userLibrary.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={userLibrary.state === "errored"}>
          <Error error={userLibrary.error} />
        </Match>
        <Match when={userLibrary.state === "ready"}>
          <For each={userLibrary()?.albums}>
            {(album) => (
              <MediaTile
                id={album.id}
                type={album.type}
                title={album.title}
                artists={[album.artists]}
                artistIds={[album.artistCatalogId]}
                mediaArt={
                  album.mediaArt && {
                    url: replaceSrc(album.mediaArt.url, 300)
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
