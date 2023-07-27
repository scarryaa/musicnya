import { IoEllipsisVertical, IoPlay } from "solid-icons/io";
import styles from "./MediaTileLarge.module.scss";
import { A } from "@solidjs/router";

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
  const constructLink = (link: string, id: string) => {
    const newId =
      link
        ?.toLowerCase()
        ?.split("/")
        ?.pop()
        ?.split("id=")
        .pop()
        ?.replace("?pp=", "")
        ?.replace("&mt=1", "") || id;

    if (link && link.includes("viewMultiRoom")) {
      return `/multiroom/${newId}`;
    } else if ((link && link.includes("pp=")) || link.includes("curator")) {
      return `/curator/${newId}`;
    } else if (link && link.includes("station")) {
      return `/station/${newId}`;
    } else if (link) {
      const newId =
        link
          ?.toLowerCase()
          ?.split("/")
          ?.pop()
          ?.split("id=")
          .pop()
          ?.replace("?pp=", "")
          ?.replace("&mt=1", "") || id;

      if (props.childType) {
        return `/${props.childType?.substring(
          0,
          props.childType.length - 1,
        )}/${newId}`;
      } else {
        return `/multiplex/${newId}`;
      }
    } else {
      return `/${props.childType?.substring(
        0,
        props.childType.length - 1,
      )}/${id}`;
    }
  };
  return (
    <div class={styles.mediaTileLarge}>
      <div class={styles.mediaTileLarge__mediaInfo}>
        <h2 class={styles.mediaTileLarge__mediaInfo__title}>{props.title}</h2>
      </div>
      <div class={styles.mediaTileLarge__overlay}>
        <A
          class={styles.mediaTileLarge__overlay__inner}
          href={constructLink(props.link || "", props.id)}
        >
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
