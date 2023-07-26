import { useParams } from "@solidjs/router";
import styles from "./Artist.module.scss";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import {
  getNestedArtwork,
  getNestedAttributes,
  getNestedData,
  getNestedEditorialArtwork,
  replaceSrc,
} from "../../util/utils";
import { IoPlay } from "solid-icons/io";
import { ButtonPrimary } from "../../components/ButtonPrimary/ButtonPrimary";
import { setQueue } from "../../api/musickit";
import { setIsShuffle } from "../../stores/store";
import { ArtistViewSelector } from "../../components/ArtistViewSelector/ArtistViewSelector";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { createArtistStore } from "../../stores/api-store";
import { Error } from "../../components/Error/Error";

export function Artist() {
  const params = useParams<{ id: string }>();

  const artistStore = createArtistStore();
  const artistData = artistStore(params);

  const artist = createSignal(artistData()?.data[0]);

  // scroll to top on params change
  createEffect(() => {
    (artistPage.scrollTop = 0), params.id;
  });

  let artistPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.artist} ref={artistPage}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            artistData.state === "pending" ||
            artistData.state === "unresolved" ||
            artistData.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={artistData.state === "errored"}>
          <Error error={artistData.error} />
        </Match>
        <Match when={artistData.state === "ready"}>
          <Show when={artist}>
            <div class={styles.artist__header}>
              <div class={styles.artist__header__image}>
                <img
                  loading="lazy"
                  decoding="async"
                  src={replaceSrc(
                    getNestedEditorialArtwork(artistData())?.subscriptionHero
                      ?.url || getNestedAttributes(artistData())?.artwork?.url,
                    getNestedEditorialArtwork(artistData())?.subscriptionHero
                      ?.height || getNestedArtwork(artistData())?.height / 4,
                  )}
                  alt="Album Art"
                  class={styles.artist__header__image__img}
                />
              </div>
              <div class={styles.artist__header__info}>
                <div class={styles.artist__header__info__title}>
                  {getNestedAttributes(artistData())?.name}
                </div>
                <div class={styles.artist__header__info__subtitle}>
                  {getNestedAttributes(artistData())?.genreNames?.[0]}
                </div>
                <div class={styles.artist__header__info__actions}>
                  <ButtonPrimary
                    label="Play"
                    icon={IoPlay}
                    onClick={() => {
                      setIsShuffle({ value: 0 });
                      setQueue("artist", getNestedData(artistData()).id, true);
                    }}
                  />
                </div>
              </div>
            </div>
            <div class={styles.artist__body}>
              <ArtistViewSelector
                artist={artistData()?.data[0]}
                data={artistData}
              />
            </div>
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
