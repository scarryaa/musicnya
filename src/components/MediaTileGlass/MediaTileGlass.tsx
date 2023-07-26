import { For, Show } from "solid-js";
import { IoPlay, IoEllipsisVertical } from "solid-icons/io";
import styles from "./MediaTileGlass.module.scss";
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

export function MediaTileGlass(props: MediaTileProps) {
  return (
    <div class={styles.mediaTileGlass}>
      <div class={styles.mediaTileGlass__overlay}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.mediaTileGlass__overlay__inner}
        >
          <IoPlay
            size={40}
            class={styles.mediaTileGlass__overlay__inner__button}
            onclick={async (e) => {
              e.preventDefault();
              await MusicKit.getInstance().setQueue({
                [props.type.substring(0, props.type.length - 1)]: props.id,
                startPlaying: true,
              });
            }}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTileGlass__overlay__inner__button__more}
            onclick={(e) => {
              e.preventDefault();
              console.log("more");
            }}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.mediaTileGlass__image}
          src={props.mediaArt.url}
          alt="Album Art"
        />
      </div>
      <div
        class={styles.mediaTileGlass__backdrop}
        style={{
          background: `url(${props.mediaArt.url})`,
          "background-position": "center",
        }}
      ></div>
      <div class={styles.mediaTileGlass__mediaInfo}>
        <A href={constructLink(props.type, props.id)}>
          <div class={styles.mediaTileGlass__mediaInfo__title}>
            {props.title}
          </div>
        </A>
        <div class={styles.mediaTileGlass__mediaInfo__artist}>
          <Show when={props?.artists?.length >= 1}>
            <For each={props.artists}>
              {(artist, i) => (
                <A
                  href={constructLink("artists", props.artistIds?.[i()])}
                  class={styles.mediaTileGlass__mediaInfo__artist__name}
                >
                  {artist}
                  {i() !== props.artists.length - 1 && ", "}
                </A>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
}
