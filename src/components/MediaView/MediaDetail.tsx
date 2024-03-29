import styles from "./MediaDetail.module.scss";
import { MediaTileNoControls } from "../MediaTileNoControls/MediaTileNoControls";
import { IoPlay, IoShuffle } from "solid-icons/io";
import { ButtonPrimary } from "../ButtonPrimary/ButtonPrimary";
import { A } from "@solidjs/router";
import { constructLink } from "../../util/utils";
import { For, Show, createSignal } from "solid-js";
import { setQueue, setShuffleMode } from "../../api/musickit";
import { setIsShuffle } from "../../stores/store";

export interface MediaDetailProps {
  title: string;
  subtitle: string;
  description: string;
  mediaArt: MusicKit.Artwork;
  artistIds: string[];
  artists: string[];
  id: string;
  type: MusicKit.MediaItemType;
  year?: string;
}

export function MediaDetail(props: MediaDetailProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = createSignal(false);

  return (
    <div class={styles.mediaDetail}>
      <MediaTileNoControls
        type={props.type}
        mediaArt={props.mediaArt}
        title={props.title}
        artistIds={props.artistIds}
        artists={props.artists}
        id={props.id}
      />
      <div class={styles.mediaDetail__details}>
        <div class={styles.mediaDetail__details__title}>{props.title}</div>
        <div class={styles.mediaDetail__details__subtitle}>
          <Show
            when={props.type === "albums" || props.type === "library-albums"}
          >
            <For each={props.artists}>
              {(artist, i) => (
                <>
                  <A
                    title={artist}
                    href={constructLink("artists", props.artistIds[i()])}
                    class={styles.mediaDetail__details__subtitle__artist}
                  >
                    {artist}
                  </A>
                  <Show when={i() < props.artists.length - 1}>, </Show>
                </>
              )}
            </For>
          </Show>
          <Show
            when={
              props.type === "playlists" || props.type === "library-playlists"
            }
          >
            {props.subtitle}
          </Show>
        </div>
        <Show when={props.year !== undefined}>
          <div class={styles.mediaDetail__details__year}>
            {props.year.substring(0, 4)}
          </div>
        </Show>
        <div
          class={
            isDescriptionExpanded()
              ? styles.mediaDetail__details__descriptionExpanded
              : styles.mediaDetail__details__description
          }
          innerHTML={props.description}
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded())}
        ></div>
        <div class={styles.mediaDetail__details__actions}>
          <ButtonPrimary
            icon={IoPlay}
            label="Play"
            onClick={() => {
              setShuffleMode(0);
              setIsShuffle({ value: 0 });

              setQueue(
                props.type
                  .substring(0, props.type.length - 1)
                  .replace("library-", ""),
                props.id,
                true
              );
            }}
          />
          <ButtonPrimary
            icon={IoShuffle}
            label="Shuffle"
            onClick={() => {
              setShuffleMode(1);
              setIsShuffle({ value: 1 });
              setQueue(
                props.type
                  .substring(0, props.type.length - 1)
                  .replace("library-", ""),
                props.id,
                true,
                Math.random() * 1000
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
