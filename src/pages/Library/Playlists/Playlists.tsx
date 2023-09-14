/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch, Match, For, createResource } from "solid-js";
import type { JSX } from "solid-js";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { replaceSrc } from "../../../util/utils";
import { Error } from "../../../components/Error/Error";
import styles from "./Playlists.module.scss";
import { getLibrary } from "../../../util/firebase";

export function Playlists(): JSX.Element {
  const [userLibrary] = createResource(async () => await getLibrary());

  return (
    <div class={styles.playlists}>
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
          <For each={userLibrary()?.playlists}>
            {(playlist) => (
              <MediaTile
                id={playlist.id}
                type={playlist.type}
                title={playlist.title}
                artists={[]}
                artistIds={[]}
                mediaArt={
                  playlist.mediaArt && {
                    url: replaceSrc(playlist.mediaArt.url, 300)
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
