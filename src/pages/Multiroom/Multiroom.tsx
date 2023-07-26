import { useParams } from "@solidjs/router";
import styles from "./Multiroom.module.scss";
import { For, Match, Show, Switch, createEffect } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { replaceSrc } from "../../util/utils";
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
                  "background-color": `#${multiroomData()?.data?.[0].attributes
                    ?.uber?.masterArt?.bgColor}`,
                }}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={replaceSrc(
                    multiroomData()?.data?.[0].attributes?.uber?.masterArt?.url,
                    Math.floor(
                      multiroomData()?.data?.[0].attributes?.uber?.masterArt
                        ?.width / 2,
                    ),
                  )}
                  alt="Album Art"
                  class={styles.multiroom__header__image__img}
                />
              </div>
            </div>
            <h1 class={styles.multiroom__title}>
              {multiroomData()?.data[0].attributes?.title}
            </h1>
            <div class={styles.multiroom__content}>
              <div class={styles.multiroom__content__description}>
                {
                  multiroomData()?.data[0].attributes?.plainEditorialNotes
                    ?.standard
                }
              </div>
              <For
                each={multiroomData()?.data[0].relationships?.children?.data}
              >
                {(item) => (
                  <MediaSelector
                    type={item.relationships?.contents?.data?.[0]?.type}
                    children={item.relationships?.contents?.data}
                    editorialElementKind={item.attributes?.editorialElementKind}
                    links={item.attributes?.links}
                    displayKind="list"
                    artistId={item.attributes?.artistId}
                    title={item.attributes?.title}
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
