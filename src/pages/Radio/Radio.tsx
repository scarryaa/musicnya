import styles from "./Radio.module.scss";
import { For, Show, createResource } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { fetchRadio } from "../../api/radio";

export function Radio() {
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
    fetchRadio,
  );

  return (
    <div class={styles.radio}>
      <h1 class={styles.radio__title}>radio</h1>
      <Show when={data.loading}>
        <LoadingSpinner />
      </Show>
      <Show when={data.error}>Error: {data.error.message}</Show>
      <Show when={data()}>
        <div class={styles.radio__content}>
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
      </Show>
    </div>
  );
}
