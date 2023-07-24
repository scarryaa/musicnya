import { useParams } from "@solidjs/router";
import styles from "./Album.module.scss";
import { Show, createResource } from "solid-js";
import { fetchPlaylist } from "../../api/playlist";
import { fetchLibraryPlaylist } from "../../api/library-playlist";
import { replaceSrc } from "../../util/utils";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { MediaTable } from "../../components/MediaView/MediaTable";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { fetchAlbum } from "../../api/album";
import { fetchLibraryAlbum } from "../../api/library-album";

export function Album() {
  const params = useParams<{ id: string }>();
  const [data] = createResource<
    any,
    {
      devToken: string;
      musicUserToken: string;
      id: string;
    },
    string
  >(
    {
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance()?.musicUserToken,
      id: params.id,
    },
    params.id.substring(0, 2) !== "l." ? fetchAlbum : fetchLibraryAlbum,
  );

  return (
    <div class={styles.album}>
      <Show when={data.loading}>
        <LoadingSpinner />
      </Show>
      <Show when={data.error}>Error: {data.error.message}</Show>
      <Show when={data()}>
        <MediaDetail
          type="albums"
          title={data()?.data[0].attributes?.name}
          mediaArt={
            data()?.data[0].attributes?.artwork && {
              url:
                replaceSrc(data()?.data[0].attributes?.artwork?.url, 300) || "",
            }
          }
          subtitle={
            data()?.data[0].relationships?.catalog?.data?.[0]?.attributes
              ?.curatorName
          }
          description={data()?.data[0].attributes?.description?.standard}
          id={data()?.id}
          artistIds={data()?.data?.[0]?.relationships?.artists?.data?.map(
            (artist: any) => artist.id,
          )}
          artists={data()?.data?.[0]?.relationships?.artists?.data?.map(
            (artist: any) => artist.attributes?.name,
          )}
        />
        <MediaTable
          showArt={false}
          items={data()?.data[0].relationships?.tracks?.data}
          class={styles.album__table}
        />
      </Show>
    </div>
  );
}
