import { useParams } from "@solidjs/router";
import styles from "./Curator.module.scss";
import { For, Match, Show, Switch } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import {
  getItemAttributes,
  getItemRelationships,
  getNestedArtwork,
  getNestedAttributes,
  getNestedEditorialArtwork,
  getNestedGroupingData,
  getNestedPlainEditorialNotes,
  replaceSrc
} from "../../util/utils";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createCuratorStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";
import type { JSX } from "solid-js";

export function Curator(): JSX.Element {
  const params = useParams<{ id: string }>();

  const curatorStore = createCuratorStore();
  const curatorData = curatorStore(params);

  // eslint-disable-next-line prefer-const -- causes app bug??
  let curatorPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.curator} ref={curatorPage}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            curatorData.state === "pending" ||
            curatorData.state === "unresolved" ||
            curatorData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={curatorData.state === "errored"}>
          <Error error={curatorData.error} />
        </Match>
        <Match when={curatorData.state === "ready"}>
          <Show when={curatorData}>
            <div class={styles.curator__header}>
              <div
                class={styles.curator__header__image}
                style={{
                  "background-color": `#${getNestedEditorialArtwork(
                    curatorData()
                  )?.storeFlowcase?.bgColor}`
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={replaceSrc(
                    getNestedEditorialArtwork(curatorData())?.superHero?.url ||
                      getNestedEditorialArtwork(curatorData())?.storeFlowcase
                        ?.url ||
                      getNestedEditorialArtwork(curatorData())?.superHeroWide
                        ?.url ||
                      getNestedArtwork(curatorData()).url,
                    Math.floor(
                      getNestedEditorialArtwork(curatorData())?.superHero
                        ?.width / 2 ||
                        getNestedEditorialArtwork(curatorData())?.storeFlowcase
                          ?.width / 2 ||
                        getNestedEditorialArtwork(curatorData())?.superHeroWide
                          ?.width / 2 ||
                        getNestedArtwork(curatorData())?.width / 2
                    )
                  )}
                  alt="Album Art"
                  class={styles.curator__header__image__img}
                />
              </div>
            </div>
            <h1 class={styles.curator__title}>
              {getNestedAttributes(curatorData())?.name}
            </h1>
            <div class={styles.curator__content}>
              <div class={styles.curator__content__description}>
                {getNestedPlainEditorialNotes(curatorData())?.standard}
              </div>
              <For
                each={
                  getNestedGroupingData(curatorData())?.[0].relationships?.tabs
                    ?.data
                }
              >
                {(item) => (
                  <For each={getItemRelationships(item)?.children?.data}>
                    {(item) => (
                      <MediaSelector
                        type="curators"
                        children={getItemRelationships(item)?.contents?.data}
                        editorialElementKind={
                          getItemAttributes(item)?.editorialElementKind
                        }
                        links={getItemAttributes(item)?.links}
                        displayKind="list"
                        artistId={getItemAttributes(item)?.artistId}
                        title={
                          getItemAttributes(item)?.title?.stringForDisplay ||
                          getItemAttributes(item)?.name
                        }
                      />
                    )}
                  </For>
                )}
              </For>
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
