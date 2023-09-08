import { Switch, Show, Match, createEffect, createSignal, For } from "solid-js";
import { useParams } from "@solidjs/router";
import { MediaDetail } from "../../../components/MediaView/MediaDetail";
import { MediaTable } from "../../../components/MediaView/MediaTable";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import {
  getItemRelationships,
  getNestedArtwork,
  getNestedAttributes,
  getNestedData,
  getNestedRelationships,
  replaceSrc,
} from "../../../util/utils";
import styles from "./Artists.module.scss";
import { createLibraryAlbumsStore, createLibraryArtistsStore } from "../../../stores/api-store";
import { Error } from "../../../components/Error/Error";
import { ArtistTableTile } from "../../../components/ArtistTableTile/ArtistTableTile";

export function Artists() {
  const params = useParams<{ id: string }>();

  const artistsStore = createLibraryArtistsStore();
  const artistsData = artistsStore();

  const albumStore = createLibraryAlbumsStore();
  const albumData = albumStore();

  const album = createSignal(albumData()?.data[0]);

  // State to hold the selected artist
  const [selectedArtist, setSelectedArtist] = createSignal(null);
  const [albums, setAlbums] = createSignal(null);

  const handleArtistClick = async (artist) => {
    setSelectedArtist(artist);
    console.log(artist.attributes.name);
    const data = albumData();
    if (data) {
      console.log(data)
      const results = findAlbumsByArtist(artist.attributes.name.toString(), data);
      console.log(results); // log the results
    }

  };

  function findAlbumsByArtist(artistName: string, jsonData: any): [string, string][] {
    // Find the top-level data objects where the name attribute matches the search string
    let result: [string, string][] = [];

    console.log(jsonData.data)
    if (jsonData.data && jsonData.data.length) {
      result = jsonData.data.filter((album: any) => album.attributes.artistName
        .toLowerCase() === artistName.toLowerCase());
    }
  
    return result;
  };
  
  createEffect(() => {
    const data = albumData();
    if (data && data.length > 0) {
      setAlbums(data[0]);
    }
  });

  return (
    <>
      <div class={styles.artists}>
        <div class={styles.artists__list}>
          {/* First column */}
          <Switch fallback={<div>Not found</div>}>
            <Match
              when={
                artistsData.state === "pending" ||
                artistsData.state === "unresolved" ||
                artistsData.state === "refreshing"
              }
            >
              <LoadingSpinner />
            </Match>
            <Match when={artistsData.state === "errored"}>
              <Error error={artistsData.error} />
            </Match>
            <Match when={artistsData.state === "ready"}>
              <For each={artistsData()?.data}>
                {(artist) => (
                  <ArtistTableTile
                    id={getItemRelationships(artist)?.catalog?.data?.[0]?.id}
                    type={artist.type}
                    title={artist.attributes.name}
                    artists={getNestedRelationships(artist)?.artists?.data?.map(
                      (artist: any) => artist.attributes.name
                    )}
                    mediaArt={
                      getItemRelationships(artist)?.catalog?.data?.[0]
                        ?.attributes?.artwork && {
                        url: replaceSrc(
                          getItemRelationships(artist)?.catalog?.data?.[0]
                            ?.attributes?.artwork.url,
                          300
                        ),
                      } || {
                        url: "",
                      }
                    }
                    onClick={() => handleArtistClick(artist)}
                  />
                )}
              </For>
            </Match>
          </Switch>
        </div>

        {/* Second column */}
        {selectedArtist() && (
          <div class={styles.artists__albums}>
            {/* Render content for the second column here */}
            <h2>{selectedArtist().attributes.name}</h2>
            <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            albumData.state === "pending" ||
            albumData.state === "unresolved" ||
            albumData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={albumData.state === "errored"}>
          <Error error={albumData.error} />
        </Match>
        <Match when={albumData.state === "ready"}>
          <Show when={album}>
            <MediaDetail
              type="albums"
              title={getNestedAttributes(albumData())?.name}
              mediaArt={
                getNestedArtwork(albumData()) && {
                  url:
                    replaceSrc(
                      getNestedArtwork(albumData())?.url,
                      300,
                    ) || "",
                }
              }
              subtitle={
                getNestedRelationships(albumData())?.catalog?.data?.[0]
                  ?.attributes?.curatorName
              }
              description={
                getNestedAttributes(albumData())?.description?.standard
              }
              id={getNestedData(albumData())?.id}
              artistIds={getNestedData(albumData())?.type === 'library-albums' ? 
              getNestedRelationships(albumData())?.artists?.data?.map((artist: any) => 
              getItemRelationships(artist)?.catalog?.data?.[0]?.id) :
                getNestedRelationships(
                  albumData(),
                )?.artists?.data?.map((artist: any) => artist.id)}
              artists={getNestedRelationships(albumData())?.artists?.data?.map(
                (artist: any) => artist.attributes?.name,
              )}
            />
            <MediaTable
              type="albums"
              id={albumData().data?.[0]?.id}
              showArt={false}
              items={getNestedRelationships(albumData())?.tracks?.data}
              class={styles.album__table}
            />
          </Show>
        </Match>
      </Switch>
          </div>
        )}

      </div>
    </>
  );
}
