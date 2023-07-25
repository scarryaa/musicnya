import { useParams } from "@solidjs/router";
import styles from "./Artist.module.scss";
import { Show, createResource } from "solid-js";
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
    fetchArtist,
  );

  return (
    <div class={styles.artist}>
      <Show when={data.loading}>
        <LoadingSpinner />
      </Show>
      <Show when={data.error}>Error: {data.error.message}</Show>
      <Show when={data()}>
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
          <ArtistViewSelector artist={data().data[0]} data={data()?.data} />
        </div>
      </Show>
    </div>
  );
}
