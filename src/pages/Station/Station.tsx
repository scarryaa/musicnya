import styles from "./Station.module.scss";

import { useParams } from "@solidjs/router";
import { fetchStation } from "../../api/station";
import { Show, createResource } from "solid-js";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { replaceSrc } from "../../util/utils";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

export function Station() {
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
    fetchStation,
  );

  return (
    <div class={styles.station}>
      <Show when={data.loading}>
        <LoadingSpinner />
      </Show>
      <Show when={data.error}>Error: {data.error.message}</Show>
      <Show when={data()}>
        <MediaDetail
          type="stations"
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
          id={data().data?.[0]?.id}
          artistIds={data()?.data?.[0]?.relationships?.artists?.data?.map(
            (artist: any) => artist.id,
          )}
          artists={data()?.data?.[0]?.relationships?.artists?.data?.map(
            (artist: any) => artist.attributes?.name,
          )}
        />
      </Show>
    </div>
  );
}
