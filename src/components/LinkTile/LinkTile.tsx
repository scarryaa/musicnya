import styles from "./LinkTile.module.scss";
import { IoChevronForward } from "solid-icons/io";

export type LinkTileProps = {
  title: string;
  url: string;
};

export function LinkTile(props: LinkTileProps) {
  return (
    <div class={styles.linkTile}>
      <a class={styles.linkTile__title} href={props.url} target="_blank">
        {props.title}
      </a>
      <IoChevronForward size={16} class={styles.linkTile__arrow} />
    </div>
  );
}
