import { IoEllipsisVertical } from "solid-icons/io";
import styles from "./MediaTileLarge.module.scss";
import { A } from "@solidjs/router";
import { createMemo } from "solid-js";
import { extractTileId } from "../../util/utils";

export type MediaTileLargeProps = {
  class?: string;
  title?: string;
  type: MusicKit.MediaItemType;
  id: string;
  mediaArt: MusicKit.Artwork;
  childType?: string;
  link?: string;
};

export function MediaTileLarge(props: MediaTileLargeProps) {
  const constructLink = createMemo(() => {
    const newId = extractTileId(props.link || "", props.id);

    if (props.link && props.link.includes("viewMultiRoom")) {
      return `/multiroom/${newId}`;
    } else if (
      (props.link && props.link.includes("pp=")) ||
      props.link?.includes("curator")
    ) {
      return `/curator/${newId}`;
    } else if (props.link && props.link.includes("station")) {
      return `/station/${newId}`;
    } else if (props.link) {
      if (props.childType) {
        return `/${props.childType?.substring(
          0,
          props.childType.length - 1,
        )}/${newId}`;
      } else {
        return `/multiplex/${newId}`;
      }
    } else {
      if (props.childType) {
        return `/${props.childType?.substring(0, props.childType.length - 1)}/${
          props.id
        }`;
      } else {
        return `/multiplex/${props.id}`;
      }
    }
  });

  return (
    <div class={styles.mediaTileLarge}>
      <div class={styles.mediaTileLarge__mediaInfo}>
        <h2 class={styles.mediaTileLarge__mediaInfo__title}>{props.title}</h2>
      </div>
      <div class={styles.mediaTileLarge__overlay}>
        <A class={styles.mediaTileLarge__overlay__inner} href={constructLink()}>
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTileLarge__overlay__inner__button__more}
          />
        </A>
        <img
          style={{ "background-color": `#${props.mediaArt.bgColor}` }}
          loading="lazy"
          decoding="async"
          class={styles.mediaTileLarge__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
}
