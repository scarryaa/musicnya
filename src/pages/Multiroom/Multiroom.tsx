import { useParams } from "@solidjs/router";
import styles from "./Multiroom.module.scss";
import { For, Match, Show, Switch, createEffect } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import {
  getItemAttributes,
  getItemRelationships,
  getNestedAttributes,
  getNestedRelationships,
  replaceSrc,
} from "../../util/utils";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { createMultiroomStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

export function Multiroom() {
  const params = useParams<{ id: string }>();

  const multiroomStore = createMultiroomStore();
  const multiroomData = multiroomStore(params);

  // scroll to top on params change
  createEffect(() => {
    (multiroomPage.scrollTop = 0), params.id;
  });

  let multiroomPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.multiroom} ref={multiroomPage}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            multiroomData.state === "pending" ||
            multiroomData.state === "unresolved" ||
            multiroomData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={multiroomData.state === "errored"}>
          <Error error={multiroomData.error} />
        </Match>
        <Match when={multiroomData.state === "ready"}>
          <Show when={multiroomData}>
            <div class={styles.multiroom__header}>
              <div
                class={styles.multiroom__header__image}
                style={{
                  "background-color": `#${getNestedAttributes(multiroomData())
                    ?.uber?.masterArt?.bgColor}`,
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={replaceSrc(
                    getNestedAttributes(multiroomData())?.uber?.masterArt?.url,
                    Math.floor(
                      getNestedAttributes(multiroomData())?.uber?.masterArt
                        ?.width / 2,
                    ),
                  )}
                  alt="Album Art"
                  class={styles.multiroom__header__image__img}
                />
              </div>
            </div>
            <h1 class={styles.multiroom__title}>
              {getNestedAttributes(multiroomData())?.title}
            </h1>
            <div class={styles.multiroom__content}>
              <div class={styles.multiroom__content__description}>
                {
                  getNestedAttributes(multiroomData())?.plainEditorialNotes
                    ?.standard
                }
              </div>
              <For
                each={getNestedRelationships(multiroomData())?.children?.data}
              >
                {(item) => (
                  <MediaSelector
                    type={getItemRelationships(item)?.contents?.data?.[0]?.type}
                    children={getItemRelationships(item)?.contents?.data}
                    editorialElementKind={
                      getItemAttributes(item)?.editorialElementKind
                    }
                    links={getItemAttributes(item)?.links}
                    displayKind="list"
                    artistId={getItemAttributes(item)?.artistId}
                    title={getItemAttributes(item)?.title}
                  />
                )}
              </For>
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
