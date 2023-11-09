/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./Album.module.scss";

import { useParams } from "@solidjs/router";
import { For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import {
  getItemRelationships,
  getNestedArtwork,
  getNestedAttributes,
  getNestedData,
  getNestedRelationships,
  replaceSrc
} from "../../util/utils";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { MediaTable } from "../../components/MediaView/MediaTable";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../components/Error/Error";
import { createAlbumStore } from "../../stores/api-store";
import type { JSX } from "solid-js";
import { ArtistTile } from "../../components/ArtistTile/ArtistTile";
import { MediaTile } from "../../components/MediaTile/MediaTile";
import { MediaSelector } from "../../components/MediaSelector/MediaSelector";

const ARTWORK_RESOLUTION = 300;

export const Album = (): JSX.Element => {
  const params = useParams<{ id: string }>();

  const albumStore = createAlbumStore();
  const albumData = albumStore(params);

  const album = createSignal(albumData()?.data[0]);

  // scroll to top on params change
  createEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-sequences
    (albumPage.scrollTop = 0), params.id;
    console.log(albumData());
  });

  // eslint-disable-next-line prefer-const
  let albumPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.album} ref={albumPage}>
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
                      ARTWORK_RESOLUTION
                    ) ?? ""
                }
              }
              year={getNestedAttributes(albumData())?.releaseDate}
              subtitle={
                getNestedRelationships(albumData())?.catalog?.data?.[0]
                  ?.attributes?.curatorName
              }
              description={
                getNestedAttributes(albumData())?.description?.standard ||
                getNestedAttributes(albumData())?.description?.short ||
                getNestedAttributes(albumData())?.editorialNotes?.standard
              }
              id={getNestedData(albumData())?.id}
              artistIds={
                getNestedData(albumData())?.type === "library-albums"
                  ? getNestedRelationships(albumData())?.artists?.data?.map(
                      (artist: any) =>
                        getItemRelationships(artist)?.catalog?.data?.[0]?.id
                    )
                  : getNestedRelationships(albumData())?.artists?.data?.map(
                      (artist: any) => artist.id
                    )
              }
              artists={getNestedRelationships(albumData())?.artists?.data?.map(
                (artist: any) => artist.attributes?.name
              )}
            />
            <MediaTable
              type="albums"
              id={albumData().data?.[0]?.id}
              showArt={false}
              items={getNestedRelationships(albumData())?.tracks?.data}
              class={styles.album__table}
            />
            {getNestedData(albumData())?.views?.["other-versions"].data
              .length && (
              <div class={styles.album__youMightAlsoLike}>
                <MediaSelector
                  links={getNestedAttributes(albumData())?.links}
                  displayKind="album"
                  type="albums"
                  children={
                    getNestedData(albumData())?.views?.["other-versions"].data
                  }
                  class={styles.album__footer__selector}
                  title="Other Versions"
                  artistId={
                    getNestedRelationships(albumData())?.artists?.data?.[0]?.id
                  }
                  editorialElementKind="album"
                />
              </div>
            )}
            {getNestedData(albumData())?.views?.["more-by-artist"].data
              .length && (
              <div class={styles.album__youMightAlsoLike}>
                <MediaSelector
                  links={getNestedAttributes(albumData())?.links}
                  displayKind="album"
                  type="albums"
                  children={
                    getNestedData(albumData())?.views?.["more-by-artist"].data
                  }
                  class={styles.album__footer__selector}
                  title="More By Artist"
                  artistId={
                    getNestedRelationships(albumData())?.artists?.data?.[0]?.id
                  }
                  editorialElementKind="album"
                />
              </div>
            )}
            {getNestedData(albumData())?.views?.["you-might-also-like"].data
              .length && (
              <div class={styles.album__youMightAlsoLike}>
                <MediaSelector
                  links={getNestedAttributes(albumData())?.links}
                  displayKind="album"
                  type="albums"
                  children={
                    getNestedData(albumData())?.views?.["you-might-also-like"]
                      .data
                  }
                  class={styles.album__footer__selector}
                  title="You Might Also Like"
                  artistId={
                    getNestedRelationships(albumData())?.artists?.data?.[0]?.id
                  }
                  editorialElementKind="album"
                />
              </div>
            )}
          </Show>
        </Match>
      </Switch>
    </div>
  );
};
