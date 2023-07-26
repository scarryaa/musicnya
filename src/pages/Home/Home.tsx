import styles from "./Home.module.scss";
import { For, Match, Show, Switch, createResource } from "solid-js";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";
import { Error } from "../../components/Error/Error";
import { createHomeStore } from "../../stores/api-store";

export function Home() {
  const homeStore = createHomeStore();
  const homeData = homeStore();

  return (
    <div class={styles.home}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            homeData.state === "pending" ||
            homeData.state === "unresolved" ||
            homeData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={homeData.state === "errored"}>
          <Error error={homeData.error} />
        </Match>
        <Match when={homeData.state === "ready"}>
          <h1 class={styles.home__title}>home</h1>
          <div class={styles.home__content}>
            <For
              each={homeData()?.data}
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
                  displayKind={item?.attributes?.display.kind}
                  title={item?.attributes?.title?.stringForDisplay}
                  type={item?.type}
                  children={item.relationships.contents.data}
                ></MediaSelector>
              )}
            </For>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
