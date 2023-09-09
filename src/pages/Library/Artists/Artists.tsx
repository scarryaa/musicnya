import {
  Switch,
  Match,
  createSignal,
  For
} from "solid-js";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { getItemAttributes, getItemRelationships, getNestedRelationships, replaceSrc } from "../../../util/utils";
import styles from "./Artists.module.scss";
import { createLibraryArtistsStore } from "../../../stores/api-store";
import { Error } from "../../../components/Error/Error";
import { ArtistTableTile } from "../../../components/ArtistTableTile/ArtistTableTile";
import { fetchLibraryAlbum } from "../../../api/get-artist-album";

export function Artists() {

  const artistsStore = createLibraryArtistsStore();
  const artistsData = artistsStore();

  let albums: any;

  // State to hold the selected artist
  const [selectedArtist, setSelectedArtist] = createSignal(null);
  const [recievedAlbums, setRecievedAlbums] = createSignal(null);
  const [albumArray, setAlbumArray] = createSignal([]);


  const handleArtistClick = async (artist) => {
    setSelectedArtist(artist);
    console.log(selectedArtist());

    setRecievedAlbums(await fetchLibraryAlbum({
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
      id: artist.id,
    }))
    albums = Object.keys(recievedAlbums().resources["library-albums"]).map((key, index) => {
      return { ...recievedAlbums().resources["library-albums"][key], index: index };
    });
    setAlbumArray(albums)
  }

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
                    artists={
                      getNestedRelationships(artist)?.artists?.data?.map(
                        (artist: any) => artist.attributes.name)
                      }
                    mediaArt={
                      getItemRelationships(artist)?.catalog?.data?.[0]?.attributes?.artwork && {
                      url: replaceSrc(
                        getItemRelationships(artist)?.catalog?.data?.[0]
                          ?.attributes?.artwork.url, 
                        300)
                      } || { url: "" }}
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
            <h2>{selectedArtist().attributes.name}</h2>
            <div class={styles.albums}>
              <For each={albumArray()}>
                {(album) => (
                  <MediaTile
                    id={album.id}
                    type={album.type}
                    title={album.attributes.name}
                    artists={getNestedRelationships(album)?.artists?.data?.map(
                      (artist: any) => artist.attributes.name,
                    )}
                    artistIds={getNestedRelationships(album)?.artists?.data?.map(
                      (artist: any) => artist.id,
                    )}
                    mediaArt={
                      getItemAttributes(album).artwork && {
                        url: replaceSrc(getItemAttributes(album).artwork.url, 300),
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