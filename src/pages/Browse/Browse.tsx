import styles from "./Browse.module.scss";
import { For, Match, Show, Switch, createSignal } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createBrowseStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

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
                each={
                  browseData()?.data[0].relationships.tabs.data[0].relationships
                    .children.data
                }
                fallback={
                  <div>
                    <p>An error occured.</p>
                  </div>
                }
              >
                {(item) => (
                  <MediaSelector
                    artistId={item?.attributes?.artistId}
                    links={item?.attributes?.links}
                    displayKind={item?.attributes?.display?.kind}
                    title={
                      item?.attributes?.title?.stringForDisplay ||
                      item?.attributes?.name
                    }
                    type={item?.type}
                    children={
                      item.relationships?.children?.data ||
                      item.relationships?.contents?.data
                    }
                    editorialElementKind={
                      item?.attributes?.editorialElementKind
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
