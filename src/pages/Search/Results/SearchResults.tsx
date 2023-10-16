import { useParams } from "@solidjs/router";
import styles from "./SearchResults.module.scss";
import { For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { createSearchResultsStore } from "../../../stores/api-store";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { MediaSelector } from "../../../components/MediaSelector/MediaSelector";
import { MediaShelf } from "../../../components/MediaShelf/MediaShelf";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { replaceSrc } from "../../../util/utils";
import { ArtistTile } from "../../../components/ArtistTile/ArtistTile";
import { SongTile } from "../../../components/SongTile/SongTile";
import { VideoTile } from "../../../components/VideoTile/VideoTile";

export function SearchResults() {
  const params = useParams<{ query: string }>();
  const { query } = params;

  const searchResultsStore = createSearchResultsStore(query);
  const searchResultsData = searchResultsStore({ term: query });

  createEffect(() => {
    console.log(searchResultsData());
  });

  const results = createSignal(searchResultsData()?.results);

  return (
    <div className={styles.searchResults}>
      <h1>results for "{query.replace("%20", " ")}"</h1>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            searchResultsData.state === "pending" ||
            searchResultsData.state === "unresolved" ||
            searchResultsData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={searchResultsData.state === "errored"}>
          <div>error</div>
        </Match>
        <Match when={searchResultsData.state === "ready"}>
          <Show when={results}>
            <Show when={searchResultsData().results?.top?.data?.length > 0}>
              <MediaShelf
                title="Top Results"
                type="songs"
                class={styles.searchResults__top}
              >
                <For each={searchResultsData().results.top.data}>
                  {(item) => (
                    <Switch fallback={<div>Not found</div>}>
                      <Match when={item.type === "songs"}>
                        <MediaTile
                          title={item.attributes.name}
                          mediaArt={
                            (item.attributes.artwork,
                            {
                              url:
                                replaceSrc(
                                  item?.attributes?.artwork?.url,
                                  800
                                ) || ""
                            })
                          }
                          type={item.type === "songs" ? "albums" : item.type}
                          id={
                            item.type === "songs"
                              ? item.relationships.albums.data?.[0].id
                              : item.id
                          }
                          artists={[item.attributes.artistName]}
                          artistIds={[item.relationships.artists.data[0].id]}
                        />
                      </Match>
                      <Match when={item.type === "albums"}>
                        <MediaTile
                          title={item.attributes.name}
                          mediaArt={
                            (item.attributes.artwork,
                            {
                              url:
                                replaceSrc(
                                  item?.attributes?.artwork?.url,
                                  800
                                ) || ""
                            })
                          }
                          type={item.type}
                          id={item.id}
                          artists={[item.attributes.artistName]}
                          artistIds={[item.relationships.artists.data[0].id]}
                        />
                      </Match>
                      <Match when={item.type === "artists"}>
                        <ArtistTile
                          title={item.attributes.name}
                          mediaArt={
                            (item.attributes.artwork,
                            {
                              url:
                                replaceSrc(
                                  item?.attributes?.artwork?.url,
                                  800
                                ) || ""
                            })
                          }
                          type={item.type}
                          id={item.id}
                        />
                      </Match>
                      <Match when={item.type === "playlists"}>
                        <MediaTile
                          title={item.attributes.name}
                          mediaArt={
                            (item.attributes.artwork,
                            {
                              url:
                                replaceSrc(item.attributes.artwork.url, 800) ||
                                ""
                            })
                          }
                          type={item.type}
                          id={item.id}
                        />
                      </Match>
                    </Switch>
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show when={searchResultsData().results?.song?.data?.length > 0}>
              <MediaShelf
                title="Songs"
                type="songs"
                class={styles.searchResults__songs}
              >
                <For each={searchResultsData().results?.song?.data}>
                  {(item) => (
                    <SongTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type === "songs" ? "albums" : item.type}
                      id={
                        item.type === "songs"
                          ? item.relationships.albums.data?.[0].id
                          : item.id
                      }
                      artists={[item.attributes.artistName]}
                      artistIds={[item.relationships.artists.data[0].id]}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show when={searchResultsData().results?.album?.data?.length > 0}>
              <MediaShelf
                title="Artists"
                type="artists"
                class={styles.searchResults__artists}
              >
                <For each={searchResultsData().results?.artist?.data}>
                  {(item) => (
                    <ArtistTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show when={searchResultsData().results?.album?.data?.length > 0}>
              <MediaShelf
                title="Albums"
                type="albums"
                class={styles.searchResults__albums}
              >
                <For each={searchResultsData().results?.album?.data}>
                  {(item) => (
                    <MediaTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                      artists={[item.attributes.artistName]}
                      artistIds={[item.relationships.artists.data[0].id]}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show
              when={searchResultsData().results?.playlist?.data?.length > 0}
            >
              <MediaShelf
                title="Playlists"
                type="playlists"
                class={styles.searchResults__playlists}
              >
                <For each={searchResultsData().results?.playlist?.data}>
                  {(item) => (
                    <MediaTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show
              when={
                searchResultsData().results?.["music-video"]?.data?.length > 0
              }
            >
              <MediaShelf
                title="Music Videos"
                type="music-videos"
                class={styles.searchResults__musicVideos}
              >
                <For each={searchResultsData().results?.music_video?.data}>
                  {(item) => (
                    <VideoTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                      artists={[item.attributes.artistName]}
                      artistIds={[item.relationships.artists.data[0].id]}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show
              when={
                searchResultsData().results?.["video-extra"]?.data?.length > 0
              }
            >
              <MediaShelf
                title="Video Extras"
                type="video-extras"
                class={styles.searchResults__videoExtras}
              >
                <For each={searchResultsData().results?.video_extra?.data}>
                  {(item) => (
                    <VideoTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                      artists={[item.attributes.artistName]}
                      artistIds={[item.relationships.artists.data[0].id]}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show
              when={searchResultsData().results?.radio_show?.data?.length > 0}
            >
              <MediaShelf
                title="Radio Shows"
                type="radio-shows"
                class={styles.searchResults__radioShows}
              >
                <For each={searchResultsData().results?.radio_show?.data}>
                  {(item) => (
                    <MediaTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show
              when={
                searchResultsData().results?.radio_episode?.data?.length > 0
              }
            >
              <MediaShelf
                title="Radio Episodes"
                type="radio-episodes"
                class={styles.searchResults__radioEpisodes}
              >
                <For each={searchResultsData().results?.radio_episode?.data}>
                  {(item) => (
                    <MediaTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
            <Show when={searchResultsData().results?.station?.data?.length > 0}>
              <MediaShelf
                title="Stations"
                type="stations"
                class={styles.searchResults__stations}
              >
                <For each={searchResultsData().results?.station?.data}>
                  {(item) => (
                    <MediaTile
                      title={item.attributes.name}
                      mediaArt={
                        (item.attributes.artwork,
                        {
                          url:
                            replaceSrc(item?.attributes?.artwork?.url, 800) ||
                            ""
                        })
                      }
                      type={item.type}
                      id={item.id}
                    />
                  )}
                </For>
              </MediaShelf>
            </Show>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
