import { useParams } from "@solidjs/router";
import styles from "./Curator.module.scss";
import { For, Match, Show, Switch } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { replaceSrc } from "../../util/utils";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createCuratorStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

export function Curator() {
  const params = useParams<{ id: string }>();

  const curatorStore = createCuratorStore();
  const curatorData = curatorStore(params);

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
                  "background-color": `#${curatorData()?.data[0].attributes
                    ?.editorialArtwork?.storeFlowcase?.bgColor}`,
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={replaceSrc(
                    curatorData()?.data[0].attributes?.editorialArtwork
                      ?.superHero?.url ||
                      curatorData()?.data[0].attributes?.editorialArtwork
                        ?.storeFlowcase?.url ||
                      curatorData()?.data[0].attributes?.editorialArtwork
                        ?.superHeroWide?.url ||
                      curatorData()?.data[0].attributes?.artwork?.url,
                    Math.floor(
                      curatorData()?.data[0].attributes?.editorialArtwork
                        ?.superHero?.width / 2 ||
                        curatorData()?.data[0].attributes?.editorialArtwork
                          ?.storeFlowcase?.width / 2 ||
                        curatorData()?.data[0].attributes?.editorialArtwork
                          ?.superHeroWide?.width / 2 ||
                        curatorData()?.data[0].attributes?.artwork?.width / 2,
                    ),
                  )}
                  alt="Album Art"
                  class={styles.curator__header__image__img}
                />
              </div>
            </div>
            <h1 class={styles.curator__title}>
              {curatorData()?.data[0].attributes?.name}
            </h1>
            <div class={styles.curator__content}>
              <div class={styles.curator__content__description}>
                {
                  curatorData()?.data[0].attributes?.plainEditorialNotes
                    ?.standard
                }
              </div>
              <For
                each={
                  curatorData()?.data[0].relationships?.grouping?.data?.[0]
                    .relationships?.tabs?.data
                }
              >
                {(item) => (
                  <For each={item.relationships?.children?.data}>
                    {(item) => (
                      <MediaSelector
                        type="curators"
                        children={item.relationships?.contents?.data}
                        editorialElementKind={
                          item.attributes?.editorialElementKind
                        }
                        links={item.attributes?.links}
                        displayKind="list"
                        artistId={item.attributes?.artistId}
                        title={
                          item.attributes?.title?.stringForDisplay ||
                          item.attributes?.name
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
