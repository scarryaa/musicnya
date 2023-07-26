import { useParams } from "@solidjs/router";
import styles from "./Artist.module.scss";
import { Match, Switch, createEffect, createResource } from "solid-js";
import { fetchArtist } from "../../api/artist";
import { replaceSrc } from "../../util/utils";
import { IoPlay } from "solid-icons/io";
import { ButtonPrimary } from "../../components/ButtonPrimary/ButtonPrimary";
import { setQueue } from "../../api/musickit";
import { setIsShuffle } from "../../stores/store";
import { ArtistViewSelector } from "../../components/ArtistViewSelector/ArtistViewSelector";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

export function Artist() {
  const params = useParams<{ id: string }>();

  const [data] = createResource(
    () => params.id,
    () => {
      return fetchArtist({
        devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
        musicUserToken: MusicKit.getInstance()?.musicUserToken,
        id: params.id,
      });
    },
  );

  // scroll to top on params change
  createEffect(() => {
    (artistPage.scrollTop = 0), params.id;
  });

  let artistPage: HTMLDivElement = undefined as unknown as HTMLDivElement;

  return (
    <div class={styles.artist} ref={artistPage}>
      <Switch fallback={<div>Not found</div>}>
        <Match when={data.state === "pending" || data.state === "unresolved"}>
          <LoadingSpinner />
        </Match>
        <Match when={data.state === "refreshing"}>
          <LoadingSpinner />
        </Match>
        <Match when={data.state === "ready"}>
          <div class={styles.artist__header}>
            <div class={styles.artist__header__image}>
              <img
                loading="lazy"
                decoding="async"
                src={replaceSrc(
                  data()?.data[0].attributes?.editorialArtwork?.subscriptionHero
                    ?.url || data()?.data[0].attributes?.artwork?.url,
                  data()?.data[0].attributes?.editorialArtwork?.subscriptionHero
                    ?.height || data()?.data[0].attributes?.artwork?.height,
                )}
                alt="Album Art"
                width={100}
                height={100}
                class={styles.artist__header__image__img}
              />
            </div>
            <div class={styles.artist__header__info}>
              <div class={styles.artist__header__info__title}>
                {data()?.data[0].attributes?.name}
              </div>
              <div class={styles.artist__header__info__subtitle}>
                {data()?.data[0].attributes?.genreNames?.[0]}
              </div>
              <div class={styles.artist__header__info__actions}>
                <ButtonPrimary
                  label="Play"
                  icon={IoPlay}
                  onClick={() => {
                    setIsShuffle({ value: 0 });
                    setQueue("artist", data()?.data[0].id, true);
                  }}
                />
              </div>
            </div>
          </div>
          <div class={styles.artist__body}>
            <ArtistViewSelector artist={data} data={data} />
          </div>
        </Match>
      </Switch>
    </div>
  );
}
