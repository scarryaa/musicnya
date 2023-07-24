import styles from "./Browse.module.scss";
import { For, Show, createResource } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { fetchBrowse } from "../../api/browse";

export function Browse() {
  const [data] = createResource<
    any,
    {
      devToken: string;
      musicUserToken: string;
    },
    string
  >(
    {
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
    },
    fetchBrowse,
  );

  return (
    <div class={styles.browse}>
      <h1 class={styles.browse__title}>browse</h1>
      <Show when={data.loading}>
        <LoadingSpinner />
      </Show>
      <Show when={data.error}>Error: {data.error.message}</Show>
      <Show when={data()}>
        <div class={styles.browse__content}>
          <For
            each={
              data()?.data[0].relationships.tabs.data[0].relationships.children
                .data
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
                editorialElementKind={item?.attributes?.editorialElementKind}
              ></MediaSelector>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
