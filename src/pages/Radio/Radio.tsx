import styles from "./Radio.module.scss";
import { For, Match, Switch } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createRadioStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

export function Radio() {
  const radioStore = createRadioStore();
  const radioData = radioStore();

  return (
    <div class={styles.radio}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            radioData.state === "pending" ||
            radioData.state === "unresolved" ||
            radioData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={radioData.state === "errored"}>
          <Error error={radioData.error} />
        </Match>
        <Match when={radioData.state === "ready"}>
          <h1 class={styles.radio__title}>radio</h1>
          <div class={styles.radio__content}>
            <For
              each={
                radioData()?.data[0].relationships.tabs.data[0].relationships
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
                  links={item?.attributes?.links}
                  editorialElementKind={item?.attributes?.editorialElementKind}
                ></MediaSelector>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
