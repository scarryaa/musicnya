import styles from "./Radio.module.scss";
import { For, Match, Switch } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createRadioStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";
import {
  getItemAttributes,
  getItemRelationships,
  getNestedTabsRelationshipsData,
} from "../../util/utils";

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
              each={getNestedTabsRelationshipsData(radioData())}
              fallback={
                <div>
                  <p>An error occured.</p>
                </div>
              }
            >
              {(item) => (
                <MediaSelector
                  artistId={getItemAttributes(item).artistId}
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
                  links={getItemAttributes(item)?.links}
                  editorialElementKind={
                    getItemAttributes(item)?.editorialElementKind
                  }
                ></MediaSelector>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
