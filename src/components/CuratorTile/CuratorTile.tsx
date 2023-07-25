import { For, Show } from "solid-js";
import { IoEllipsisVertical, IoLink } from "solid-icons/io";
import styles from "./CuratorTile.module.scss";
import { A } from "@solidjs/router";
import { constructLink } from "../../util/utils";

export type CuratorTileProps = {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
  artistIds: string[];
};

export function CuratorTile(props: CuratorTileProps) {
  return (
    <div class={styles.curatorTile}>
      <div class={styles.curatorTile__overlay}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.curatorTile__overlay__inner}
        >
          <IoLink
            size={40}
            class={styles.curatorTile__overlay__inner__button}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.curatorTile__overlay__inner__button__more}
            onclick={(e) => {
              e.preventDefault();
              console.log("more");
            }}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.curatorTile__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={150}
          height={150}
        />
      </div>
      <div class={styles.curatorTile__mediaInfo}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.curatorTile__mediaInfo__title}
        >
          {props.title}
        </A>
        <div class={styles.curatorTile__mediaInfo__artist}>
          <For each={props.artists}>
            {(artist, i) => (
              <A
                href={constructLink("artists", props.artistIds?.[i()])}
                class={styles.curatorTile__mediaInfo__artist__name}
              >
                {artist}
                <Show
                  when={
                    props.artists.length > 1 &&
                    artist !== props.artists[props.artists.length - 1]
                  }
                >
                  <span
                    class={styles.curatorTile__mediaInfo__artist__separator}
                  >
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
