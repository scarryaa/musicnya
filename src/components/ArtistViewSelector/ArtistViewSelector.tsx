import { For } from "solid-js";
import styles from "./ArtistViewSelector.module.scss";
import { MediaSelector } from "../MediaSelector/MediaSelector";

export type ArtistViewSelectorProps = {
  artist: {
    name: string;
    id: string;
  };
  data: any;
};

export enum ArtistCategory {
  "featured-release" = "featured-release",
  "latest-release" = "latest-release",
  "top-songs" = "top-songs",
  "featured-albums" = "featured-albums",
  "full-albums" = "full-albums",
  "top-music-videos" = "top-music-videos",
  "playlists" = "playlists",
  "singles" = "singles",
  "live-albums" = "live-albums",
  "compilation-albums" = "compilation-albums",
  "appears-on-albums" = "appears-on-albums",
  "radio-shows" = "radio-shows",
  "more-to-hear" = "more-to-hear",
  "more-to-see" = "more-to-see",
  "similar-artists" = "similar-artists",
}

export enum ArtistCategoryTitle {
  "featured-release" = "Featured Release",
  "latest-release" = "Latest Release",
  "top-songs" = "Top Songs",
  "featured-albums" = "Featured Albums",
  "full-albums" = "Full Albums",
  "top-music-videos" = "Top Music Videos",
  "playlists" = "Playlists",
  "singles" = "Singles",
  "live-albums" = "Live Albums",
  "compilation-albums" = "Compilation Albums",
  "appears-on-albums" = "Appears On Albums",
  "radio-shows" = "Radio Shows",
  "more-to-hear" = "More To Hear",
  "more-to-see" = "More To See",
  "similar-artists" = "Similar Artists",
}

export function ArtistViewSelector(props: ArtistViewSelectorProps) {
  console.log(props.data());

  return (
    <div class={styles.artistViewSelector}>
      <For each={Object.values(ArtistCategory)}>
        {(category) => {
          if (!props.data()?.data?.[0]?.views?.[category]?.data?.length) {
            return null;
          }

          return (
            <div class={styles.artistViewSelector__section}>
              <MediaSelector
                title={ArtistCategoryTitle[category]}
                children={props.data()?.data?.[0]?.views?.[category]?.data}
                displayKind="list"
                artistId={props?.artist?.id}
                links={props.data()?.data?.[0]?.views?.[category]?.links}
                type={props.data()?.data?.[0]?.views?.[category]?.data[0]?.type}
              />
            </div>
          );
        }}
      </For>
    </div>
  );
}
