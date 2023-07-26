import styles from "./Browse.module.scss";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createBrowseStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";
import {
  getItemAttributes,
  getItemRelationships,
  getNestedTabsRelationshipsData,
} from "../../util/utils";

export function Browse() {
  const browseStore = createBrowseStore();
  const browseData = browseStore();

  const browse = createSignal(browseData()?.data[0]);

  return (
    <div class={styles.browse}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            browseData.state === "pending" ||
            browseData.state === "unresolved" ||
            browseData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={browseData.state === "errored"}>
          <Error error={browseData.error} />
        </Match>
        <Match when={browseData.state === "ready"}>
          <Show when={browse}>
            <h1 class={styles.browse__title}>browse</h1>
            <div class={styles.browse__content}>
              <For
                each={getNestedTabsRelationshipsData(browseData())}
                fallback={
                  <div>
                    <p>An error occured.</p>
                  </div>
                }
              >
                {(item) => (
                  <MediaSelector
                    artistId={getItemAttributes(item)?.artistId}
                    links={getItemAttributes(item)?.links}
                    displayKind={getItemAttributes(item)?.display?.kind}
                    title={
                      getItemAttributes(item)?.title?.stringForDisplay ||
                      getItemAttributes(item)?.name
                    }
                    type={item?.type}
                    children={
                      getItemRelationships(item)?.children?.data ||
                      getItemRelationships(item)?.contents?.data
                    }
                    editorialElementKind={
                      getItemAttributes(item)?.editorialElementKind
                    }
                  ></MediaSelector>
                )}
              </For>
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
