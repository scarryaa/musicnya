import styles from "./EditorialTileLarge.module.scss";

export type EditorialTileLargeProps = {
  mediaArt: MusicKit.Artwork;
  badge: string;
  title: string;
  subtitle: string;
  type: MusicKit.MediaItemType;
  id: string;
};

export function EditorialTileLarge(props: EditorialTileLargeProps) {
  return (
    <div class={styles.editorialTileLarge}>
      <div class={styles.editorialTileLarge__mediaInfo}>
        <div class={styles.editorialTileLarge__mediaInfo__badge}>
          {props.badge}
        </div>
        <div class={styles.editorialTileLarge__mediaInfo__title}>
          {props.title}
        </div>
        <div class={styles.editorialTileLarge__mediaInfo__subtitle}>
          {props.subtitle}
        </div>
      </div>
      <div class={styles.editorialTileLarge__overlay}>
        <div class={styles.editorialTileLarge__overlay__inner} />
        <img
          loading="lazy"
          decoding="async"
          class={styles.editorialTileLarge__image}
          src={props.mediaArt.url}
          alt="Album Art"
          width={300}
          height={150}
        />
      </div>
    </div>
  );
}
