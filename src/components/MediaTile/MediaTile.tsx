import { For, Show } from "solid-js";
import { IoPlay, IoEllipsisVertical } from "solid-icons/io";
import styles from "./MediaTile.module.scss";
import { setQueue, stop } from "../../api/musickit";
import { A } from "@solidjs/router";
import { constructLink } from "../../util/utils";

export type MediaTileProps = {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
  artistIds: string[];
};

export function MediaTile(props: MediaTileProps) {
  return (
    <div class={styles.mediaTile}>
      <div class={styles.mediaTile__overlay}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.mediaTile__overlay__inner}
        >
          <IoPlay
            size={40}
            class={styles.mediaTile__overlay__inner__button}
            onclick={async (e) => {
              e.preventDefault();
              stop();
              setQueue(
                props.type
                  .substring(0, props.type.length - 1)
                  .replace("library-", ""),
                props.id,
                true,
              );
            }}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTile__overlay__inner__button__more}
            onclick={(e) => {
              e.preventDefault();
              console.log("more");
            }}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.mediaTile__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={150}
          height={150}
        />
      </div>
      <div class={styles.mediaTile__mediaInfo}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.mediaTile__mediaInfo__title}
        >
          {props.title}
        </A>
        <div class={styles.mediaTile__mediaInfo__artist}>
          <For each={props.artists}>
            {(artist, i) => (
              <A
                href={constructLink("artists", props.artistIds?.[i()])}
                class={styles.mediaTile__mediaInfo__artist__name}
              >
                {artist}
                <Show
                  when={
                    props.artists.length > 1 &&
                    artist !== props.artists[props.artists.length - 1]
                  }
                >
                  <span class={styles.mediaTile__mediaInfo__artist__separator}>
                    ,{" "}
                  </span>
                </Show>
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
