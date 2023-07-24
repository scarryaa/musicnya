import { useParams } from "@solidjs/router";
import styles from "./Playlist.module.scss";
import { createResource } from "solid-js";
import { fetchPlaylist } from "../../api/playlist";
import { fetchLibraryPlaylist } from "../../api/library-playlist";
import { replaceSrc } from "../../util/utils";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { MediaTable } from "../../components/MediaView/MediaTable";

export function Playlist() {
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
    params.id.substring(0, 2) === "pl" ? fetchPlaylist : fetchLibraryPlaylist,
  );

  console.log(params.id);
  return (
    <div class={styles.playlist}>
      <MediaDetail
        type="playlists"
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
        artistIds={data()?.attributes?.curatorName}
        artists={data()?.attributes?.curatorName}
      />
      <MediaTable
        items={data()?.data[0].relationships?.tracks?.data}
        class={styles.playlist__table}
      />
    </div>
  );
}
