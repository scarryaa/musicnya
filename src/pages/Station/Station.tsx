import styles from "./Station.module.scss";

import { useParams } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import { MediaDetail } from "../../components/MediaView/MediaDetail";
import {
  getItemAttributes,
  getNestedArtwork,
  getNestedAttributes,
  getNestedRelationships,
  replaceSrc,
} from "../../util/utils";
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
            title={getNestedAttributes(stationData())?.name}
            mediaArt={
              getNestedAttributes(stationData())?.artwork && {
                url:
                  replaceSrc(getNestedArtwork(stationData())?.url, 300) || "",
              }
            }
            subtitle={
              getNestedRelationships(stationData())?.catalog?.data?.[0]
                ?.attributes?.curatorName
            }
            description={
              getNestedAttributes(stationData()).description?.standard
            }
            id={stationData().data?.[0]?.id}
            artistIds={getNestedRelationships(
              stationData(),
            )?.artists?.data?.map((artist: any) => artist.id)}
            artists={getNestedRelationships(stationData())?.artists?.data?.map(
              (artist: any) => getItemAttributes(artist).name,
            )}
          />
        </Match>
      </Switch>
    </div>
  );
}
