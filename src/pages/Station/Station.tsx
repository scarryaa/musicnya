import styles from "./Station.module.scss";

import { useParams } from "@solidjs/router";
import { fetchStation } from "../../api/station";
import { Match, Show, Switch, createResource } from "solid-js";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import { replaceSrc } from "../../util/utils";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { createStationStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

export function Station() {
  const params = useParams<{ id: string }>();

  const stationStore = createStationStore();
  const stationData = stationStore(params);

  return (
    <div class={styles.station}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            stationData.state === "pending" ||
            stationData.state === "unresolved" ||
            stationData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={stationData.state === "errored"}>
          <Error error={stationData.error} />
        </Match>
        <Match when={stationData.state === "ready"}>
          <MediaDetail
            type="stations"
            title={stationData()?.data[0].attributes?.name}
            mediaArt={
              stationData()?.data[0].attributes?.artwork && {
                url:
                  replaceSrc(
                    stationData()?.data[0].attributes?.artwork?.url,
                    300,
                  ) || "",
              }
            }
            subtitle={
              stationData()?.data[0].relationships?.catalog?.data?.[0]
                ?.attributes?.curatorName
            }
            description={
              stationData()?.data[0].attributes?.description?.standard
            }
            id={stationData().data?.[0]?.id}
            artistIds={stationData()?.data?.[0]?.relationships?.artists?.data?.map(
              (artist: any) => artist.id,
            )}
            artists={stationData()?.data?.[0]?.relationships?.artists?.data?.map(
              (artist: any) => artist.attributes?.name,
            )}
          />
        </Match>
      </Switch>
    </div>
  );
}
