import { For, Match, Show, Switch, createSignal } from "solid-js";
import { createSearchCategoriesStore } from "../../stores/api-store";
import styles from "./Search.module.scss";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../components/Error/Error";
import { replaceSrc } from "../../util/utils";
import { SearchTile } from "../../components/SearchTile/SearchTile";
import { fetchSearchSuggestions } from "../../api/search";
import { SearchResultTile } from "../../components/SearchResultTile/SearchResultTile";

export function Search() {
  const searchCategoriesStore = createSearchCategoriesStore();
  const searchCategoriesData = searchCategoriesStore();

  const [results, setResults] = createSignal({} as any);

  const constructLink = (
    kind: string,
    type: string,
    term: string,
    id: string,
    url: string
  ) => {
    const albumId = url?.split("/")?.pop()?.split("?")[0];
    if (kind === "terms") return `/search/${term}`;
    else if (type === "songs") return `/album/${albumId}#${id}`;
    return `/${type?.substring(0, type.length - 1)}/${id}`;
  };

  return (
    <div class={styles.search}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            searchCategoriesData.state === "pending" ||
            searchCategoriesData.state === "unresolved" ||
            searchCategoriesData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={searchCategoriesData.state === "errored"}>
          <Error error={searchCategoriesData.error} />
        </Match>
        <Match when={searchCategoriesData.state === "ready"}>
          <Show when={searchCategoriesData}>
            <div class={styles.search__header}>
              <h1 class={styles.search__header__title}>search</h1>
              <input
                type="text"
                class={styles.search__header__input}
                oninput={async (e) => {
                  if (!(e.target as HTMLInputElement).value) {
                    setResults(undefined);
                    return;
                  }

                  setResults(
                    await fetchSearchSuggestions({
                      devToken: MusicKit.getInstance().developerToken,
                      musicUserToken: MusicKit.getInstance().musicUserToken,
                      term: (e.target as HTMLInputElement).value
                    })
                  );
                }}
              />
              <div class={styles.search__header__results}>
                <For each={results()?.results?.suggestions}>
                  {(suggestion) => (
                    <SearchResultTile
                      title={
                        suggestion?.content?.attributes?.name ||
                        suggestion?.displayTerm
                      }
                      link={constructLink(
                        suggestion?.kind,
                        suggestion?.content?.type,
                        suggestion?.searchTerm,
                        suggestion?.id || suggestion?.content?.id,
                        suggestion?.content?.attributes?.url
                      )}
                      artist={suggestion?.content?.attributes?.artistName}
                      id={suggestion?.id}
                      mediaArt={
                        suggestion?.content?.attributes?.artwork && {
                          url: replaceSrc(
                            suggestion?.content?.attributes?.artwork?.url,
                            50
                          )
                        }
                      }
                      type={suggestion?.content?.type}
                      kind={suggestion?.kind}
                    />
                  )}
                </For>
              </div>
            </div>
            <div class={styles.search__content}>
              <For each={searchCategoriesData()?.data}>
                {(category) => (
                  <For each={category.relationships.contents.data}>
                    {(content) => (
                      <SearchTile
                        id={content.id}
                        type={content.type}
                        artists={content.attributes.artistName}
                        title={
                          content.attributes.name ||
                          content.attributes.editorialNotes.name
                        }
                        mediaArt={
                          (content.attributes?.editorialArtwork ||
                            content.attributes?.artwork) && {
                            url: replaceSrc(
                              content?.attributes?.editorialArtwork
                                ?.subscriptionCover?.url ||
                                content.attributes?.artwork?.url ||
                                content.attributes?.editorialArtwork?.artwork
                                  ?.url,
                              600
                            )
                          }
                        }
                        link={content.attributes.url}
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
