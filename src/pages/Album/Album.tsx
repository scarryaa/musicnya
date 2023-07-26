import styles from "./Album.module.scss";

import { useParams } from "@solidjs/router";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import {
  getNestedArtwork,
  getNestedAttributes,
  getNestedData,
  getNestedRelationships,
  replaceSrc,
} from "../../util/utils";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { MediaTable } from "../../components/MediaView/MediaTable";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { Error } from "../../components/Error/Error";
import { createAlbumStore } from "../../stores/api-store";

const ARTWORK_RESOLUTION = 300;

export const Album = () => {
  const params = useParams<{ id: string }>();

  const albumStore = createAlbumStore();
  const albumData = albumStore(params);

  const album = createSignal(albumData()?.data[0]);

  // scroll to top on params change
  createEffect(() => {
    (albumPage.scrollTop = 0), params.id;
  });

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
                      ARTWORK_RESOLUTION,
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
              artistIds={getNestedRelationships(
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
  );
};
