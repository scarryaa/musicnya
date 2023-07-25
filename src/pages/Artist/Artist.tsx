import { useParams } from "@solidjs/router";
import styles from "./Artist.module.scss";
import { createResource } from "solid-js";
import { fetchArtist } from "../../api/artist";
import { replaceSrc } from "../../util/utils";

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
      <div class={styles.artist__header}>
        <div class={styles.artist__header__image}>
          <img
            loading="lazy"
            decoding="async"
            src={replaceSrc(
              data()?.data[0].attributes?.editorialArtwork?.subscriptionHero
                ?.url || data()?.data[0].attributes?.artwork?.url,
              1200,
            )}
            alt="Album Art"
            width={100}
            height={100}
            class={styles.artist__header__image__img}
          />
        </div>
      </div>
      <div class={styles.artist__body}>
        <div class={styles.artist__body__title}>
          {data()?.data[0].attributes?.name}
        </div>
        <div class={styles.artist__body__subtitle}>
          {data()?.data[0].attributes?.genreNames?.join(", ")}
        </div>
        <div class={styles.artist__body__description}>
          {data()?.data[0].attributes?.editorialNotes?.standard}
        </div>
      </div>
    </div>
  );
}
