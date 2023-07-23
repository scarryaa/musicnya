import styles from "./Home.module.scss";
import { For, Show, createResource } from "solid-js";
import { fetchRecommendations } from "../../api/home";
import { MediaTile } from "../../components/MediaTile/MediaTile";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaShelf } from "../../components/MediaShelf/MediaShelf";
import { replaceSrc, splitArtists } from "../../util/utils";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";

export function Home() {
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
    fetchRecommendations,
  );

  return (
    <div class={styles.home}>
      <h1 class={styles.home__title}>home</h1>
      <Show when={data.loading}>
        <LoadingSpinner />
      </Show>
      <Show when={data.error}>Error: {data.error.message}</Show>
      <Show when={data()}>
        <div class={styles.home__content}>
          <For
            each={data()?.data}
            fallback={
              <div>
                <p>An error occured.</p>
              </div>
            }
          >
            {(item) => (
              <MediaSelector
                displayKind={item?.attributes?.display.kind}
                title={item?.attributes?.title?.stringForDisplay}
                type={item?.type}
                children={item.relationships.contents.data}
              ></MediaSelector>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
