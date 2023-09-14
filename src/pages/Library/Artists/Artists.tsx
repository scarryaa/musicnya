/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Switch,
  Match,
  createSignal,
  For,
  type JSX,
  createResource
} from "solid-js";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { getItemRelationships, replaceSrc } from "../../../util/utils";
import styles from "./Artists.module.scss";
import { Error } from "../../../components/Error/Error";
import { ArtistTableTile } from "../../../components/ArtistTableTile/ArtistTableTile";
import { A } from "@solidjs/router";
import { getLibrary } from "../../../util/firebase";

export function Artists(): JSX.Element {
  const [userLibrary] = createResource(async () => await getLibrary());

  // State to hold the selected artist
  const [selectedArtist, setSelectedArtist] = createSignal(null as any);
  const [albumArray, setAlbumArray] = createSignal([]);

  const handleArtistClick = async (artist: any): Promise<void> => {
    setSelectedArtist(artist);
    console.log(selectedArtist());

    setAlbumArray(
      userLibrary()?.albums.filter((album: any) =>
        album.artistIds.includes(artist.id)
      )
    );
  };

  return (
    <>
      <div class={styles.artists}>
        <div class={styles.artists__list}>
          {/* First column */}
          <Switch fallback={<div>Not found</div>}>
            <Match
              when={
                userLibrary.state === "pending" ||
                userLibrary.state === "unresolved" ||
                userLibrary.state === "refreshing"
              }
            >
              <LoadingSpinner />
            </Match>
            <Match when={userLibrary.state === "errored"}>
              <Error error={userLibrary.error} />
            </Match>
            <Match when={userLibrary.state === "ready"}>
              <For each={userLibrary()?.artists}>
                {(artist) => (
                  <ArtistTableTile
                    id={getItemRelationships(artist)?.catalog?.data?.[0]?.id}
                    type={artist.type}
                    title={artist.title}
                    mediaArt={
                      artist.mediaArt && {
                        url: replaceSrc(artist.mediaArt.url, 300)
                      }
                    }
                    artists={[""]}
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () => {
                      // Clear the selected artist and albums when a new artist is clicked
                      setSelectedArtist(null);
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
            <div class={styles.artists__albums__header}>
              <h2>{selectedArtist()?.attributes?.name}</h2>
              <A
                class={styles.artists__albums__header__showInAppleMusic}
                href={`/artist/${selectedArtist()?.artistIds[0]}`}
              >
                Show in Apple Music
              </A>
            </div>
            <div class={styles.albums}>
              <For each={albumArray()}>
                {(album: any) => (
                  <MediaTile
                    id={album.id}
                    type={album.type}
                    title={album.title}
                    artists={[]}
                    artistIds={[]}
                    mediaArt={
                      album.mediaArt.url && {
                        url: replaceSrc(album.mediaArt.url, 300)
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
