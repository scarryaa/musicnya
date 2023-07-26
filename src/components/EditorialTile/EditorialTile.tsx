import { JSX } from "solid-js";
import styles from "./EditorialTile.module.scss";
import { IoEllipsisVertical, IoPlay } from "solid-icons/io";
import { A } from "@solidjs/router";

export type EditorialTileProps = {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
  link: string;
  editorialElementKind: string;
};

export function EditorialTile(props: EditorialTileProps) {
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

      return `/multiplex/${newId}`;
    } else {
      return "#";
    }
  };

  console.log(props.link);
  console.log(props.editorialElementKind);
  return (
    <div class={styles.editorialTile}>
      <div class={styles.editorialTile__overlay}>
        <A
          class={styles.editorialTile__overlay__inner}
          href={constructLink(props.link, props.id)}
        >
          <IoEllipsisVertical
            size={26}
            class={styles.editorialTile__overlay__inner__button__more}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.editorialTile__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={300}
          height={150}
        />
      </div>
      <div class={styles.editorialTile__mediaInfo}>
        <div class={styles.editorialTile__mediaInfo__title}>{props.title}</div>
      </div>
    </div>
  );
}
