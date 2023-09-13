/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch, Match, createSignal, For, type JSX } from "solid-js";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import {
  getItemAttributes,
  getItemRelationships,
  getNestedRelationships,
  replaceSrc
} from "../../../util/utils";
import styles from "./Artists.module.scss";
import { createLibraryArtistsStore } from "../../../stores/api-store";
import { Error } from "../../../components/Error/Error";
import { ArtistTableTile } from "../../../components/ArtistTableTile/ArtistTableTile";
import { fetchLibraryAlbum } from "../../../api/get-artist-album";
import * as config from "../../../../config.json";

export function Artists(): JSX.Element {
  const artistsStore = createLibraryArtistsStore();
  const artistsData = artistsStore();

  let albums: any;

  // State to hold the selected artist
  const [selectedArtist, setSelectedArtist] = createSignal([] as any);
  const [recievedAlbums, setRecievedAlbums] = createSignal([] as any);
  const [albumArray, setAlbumArray] = createSignal([]);

  const handleArtistClick = async (artist: any): Promise<void> => {
    setSelectedArtist(artist);
    console.log(selectedArtist());

    setRecievedAlbums(
      await fetchLibraryAlbum({
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken,
        id: artist.id
      })
    );
    albums = Object.keys(recievedAlbums().resources["library-albums"]).map(
      (key, index) => {
        return {
          ...recievedAlbums().resources["library-albums"][key],
          index
        };
      }
    );
    setAlbumArray(albums);
  };

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
                      (getItemRelationships(artist)?.catalog?.data?.[0]
                        ?.attributes?.artwork && {
                        url: replaceSrc(
                          getItemRelationships(artist)?.catalog?.data?.[0]
                            ?.attributes?.artwork.url,
                          300
                        )
                      }) || { url: "" }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () => {
                      // Clear the selected artist and albums when a new artist is clicked
                      setSelectedArtist(null);
                      setRecievedAlbums(null);
                      setAlbumArray([]);
                      await handleArtistClick(artist);
                    }}
                  />
                )}
              </For>
            </Match>
          </Switch>
        </div>

        {/* Second column */}
        {selectedArtist() && (
          <div class={styles.artists__albums}>
            <h2>{selectedArtist().attributes?.name}</h2>
            <div class={styles.albums}>
              <For each={albumArray()}>
                {(album: any) => (
                  <MediaTile
                    id={album.id}
                    type={album.type}
                    title={album.attributes.name}
                    artists={getNestedRelationships(album)?.artists?.data?.map(
                      (artist: any) => artist.attributes.name
                    )}
                    artistIds={getNestedRelationships(
                      album
                    )?.artists?.data?.map((artist: any) => artist.id)}
                    mediaArt={
                      getItemAttributes(album).artwork && {
                        url: replaceSrc(
                          getItemAttributes(album).artwork.url,
                          300
                        )
                      }
                    }
                  />
                )}
              </For>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
