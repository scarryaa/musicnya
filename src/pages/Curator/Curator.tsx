import { useParams } from "@solidjs/router";
import styles from "./Curator.module.scss";
import { For, Show, createEffect, createSignal } from "solid-js";
import { fetchCurator } from "../../api/curator";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { replaceSrc } from "../../util/utils";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";

export function Curator() {
  const params = useParams<{ id: string }>();
  const [data, setData] = createSignal<any>(null);
  createEffect(() => {
    curatorPage.scrollTop = 0;
    setData(null);
    fetchCurator({
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
      id: params.id,
    }).then((res) => setData({ ...res }));
  });

  let curatorPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.curator} ref={curatorPage}>
      <Show when={!data()}>
        <LoadingSpinner />
      </Show>
      <Show when={data()}>
        <div class={styles.curator__header}>
          <div
            class={styles.curator__header__image}
            style={{
              "background-color": `#${data()?.data[0].attributes
                ?.editorialArtwork?.storeFlowcase?.bgColor}`,
            }}
          >
            <img
              loading="lazy"
              decoding="async"
              src={replaceSrc(
                data()?.data[0].attributes?.editorialArtwork?.superHero?.url ||
                  data()?.data[0].attributes?.editorialArtwork?.storeFlowcase
                    ?.url ||
                  data()?.data[0].attributes?.editorialArtwork?.superHeroWide
                    ?.url ||
                  data()?.data[0].attributes?.artwork?.url,
                Math.floor(
                  data()?.data[0].attributes?.editorialArtwork?.superHero
                    ?.width / 2 ||
                    data()?.data[0].attributes?.editorialArtwork?.storeFlowcase
                      ?.width / 2 ||
                    data()?.data[0].attributes?.editorialArtwork?.superHeroWide
                      ?.width / 2 ||
                    data()?.data[0].attributes?.artwork?.width / 2,
                ),
              )}
              alt="Album Art"
              width={100}
              height={100}
              class={styles.curator__header__image__img}
            />
          </div>
        </div>
        <h1 class={styles.curator__title}>
          {data()?.data[0].attributes?.name}
        </h1>
        <div class={styles.curator__content}>
          <div class={styles.curator__content__description}>
            {data()?.data[0].attributes?.plainEditorialNotes?.standard}
          </div>
          <For
            each={
              data()?.data[0].relationships?.grouping?.data?.[0].relationships
                ?.tabs?.data
            }
          >
            {(item) => (
              <For each={item.relationships?.children?.data}>
                {(item) => (
                  <MediaSelector
                    type="curators"
                    children={item.relationships?.contents?.data}
                    editorialElementKind={item.attributes?.editorialElementKind}
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
    </div>
  );
}
