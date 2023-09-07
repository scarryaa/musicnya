import { Switch, Match, createSignal, For } from "solid-js";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { getNestedRelationships, replaceSrc, getItemRelationships } from "../../../util/utils";
import styles from "./Artists.module.scss";
import { ArtistTile } from "../../../components/ArtistTile/ArtistTile";
import { createLibraryArtistsStore } from "../../../stores/api-store";
import { Error } from "../../../components/Error/Error";
import { ArtistTableTile } from "../../../components/ArtistTableTile/ArtistTableTile";

export function Artists() {
  const artistsStore = createLibraryArtistsStore();
  const artistsData = artistsStore();

  // State to hold the selected artist
  const [selectedArtist, setSelectedArtist] = createSignal(null);

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    console.log(selectedArtist().attributes.name)
  };
  
  return (
    <>
      <div class={styles.artists__list}>
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
                        300,
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
    </>
  );
}
