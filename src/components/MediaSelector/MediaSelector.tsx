import { For, JSX, Match, Switch } from "solid-js";
import styles from "./MediaShelf.module.scss";
import { MediaTile } from "../MediaTile/MediaTile";
import { replaceSrc, splitArtists } from "../../util/utils";
import { MediaShelf } from "../MediaShelf/MediaShelf";
import { MediaTileLarge } from "../MediaTileLarge/MediaTileLarge";
import { MediaTileGlass } from "../MediaTileGlass/MediaTileGlass";

export type MediaSelectorProps = {
  children: any;
  class?: string;
  title?: string;
  type: MusicKit.MediaItemType;
  displayKind: string;
  editorialElementKind?: string;
};

interface ComponentProps {
  id: string;
  mediaArt: MusicKit.Artwork;
  type: MusicKit.MediaItemType;
  title: string;
  artist: string[];
}

interface ExtraData {
  artistKey?: string;
}

const MediaComponentFactory = (
  ComponentType: (props: ComponentProps) => JSX.Element,
  extraData?: ExtraData,
) => {
  return (props: MediaSelectorProps) => {
    return (
      <MediaShelf {...props}>
        <For each={props.children}>
          {(item) => (
            <ComponentType
              id={item?.id}
              mediaArt={{
                ...(item.attributes.artwork ||
                  item.relationships?.contents?.data?.[0]?.attributes?.artwork),
                url: replaceSrc(
                  item?.attributes?.artwork?.url ||
                    item.relationships?.contents?.data?.[0]?.attributes?.artwork
                      .url,
                  item?.attributes?.artwork?.height ||
                    item.relationships?.contents?.data?.[0]?.attributes?.artwork
                      .height,
                ),
              }}
              type={item?.type}
              title={item?.attributes?.name}
              artist={splitArtists(
                item?.attributes?.artistName || extraData?.artistKey,
              )}
            />
          )}
        </For>
      </MediaShelf>
    );
  };
};

const MediaComponents = {
  MusicNotesHeroShelf: MediaComponentFactory(MediaTileGlass),
  MusicSuperHeroShelf: (props: MediaSelectorProps) => (
    <MediaTileLarge
      {...props}
      id={props.children[0]?.id}
      title={
        props.children[0]?.attributes?.plainEditorialNotes?.tagline ||
        props.children[0]?.attributes?.name
      }
      mediaArt={{
        ...props.children[0]?.attributes?.artwork,
        url: replaceSrc(
          props.children[0]?.attributes?.artwork?.url ||
            props.children[0]?.attributes?.artwork?.bgColor,
          props.children[0]?.attributes?.artwork?.height,
        ),
      }}
    />
  ),
  316: MediaComponentFactory(MediaTile),
  322: MediaComponentFactory(MediaTile),
  326: MediaComponentFactory(MediaTile),
  336: MediaComponentFactory(MediaTile),
  "editorial-elements": MediaComponentFactory(MediaTile),
  "personal-recommendation": (props: MediaSelectorProps) => (
    <Switch fallback={<div>Something went wrong.</div>}>
      <Match when={props.children[0].type === "albums"}>
        {MediaComponents["albums"](props)}
      </Match>
      <Match when={props.children[0].type === "playlists"}>
        {MediaComponents["playlists"](props)}
      </Match>
      <Match when={props.children[0].type === "songs"}>
        {MediaComponents["songs"](props)}
      </Match>
      <Match when={props.children[0].type === "music-videos"}>
        {MediaComponents["music-videos"](props)}
      </Match>
      <Match when={props.children[0].type === "artists"}>
        {MediaComponents["artists"](props)}
      </Match>
      <Match when={props.children[0].type === "stations"}>
        {MediaComponents["stations"](props)}
      </Match>
    </Switch>
  ),
  albums: MediaComponentFactory(MediaTile),
  playlists: MediaComponentFactory(MediaTile, { artistKey: "curatorName" }),
  songs: MediaComponentFactory(MediaTile),
  "music-videos": MediaComponentFactory(MediaTile),
  artists: MediaComponentFactory(MediaTile),
  stations: MediaComponentFactory(MediaTile),
};

const isMediaComponentsKey = (
  key: any,
): key is keyof typeof MediaComponents => {
  return typeof key === "string" && MediaComponents.hasOwnProperty(key);
};

export function MediaSelector(props: MediaSelectorProps) {
  console.log(props);

  return (
    <Switch fallback={<div>Something went wrong.</div>}>
      {Object.keys(MediaComponents).map((key) => {
        if (isMediaComponentsKey(key)) {
          return (
            <Match
              when={
                props.displayKind === key ||
                props.editorialElementKind === key ||
                props.type === key
              }
            >
              {MediaComponents[key](props)}
            </Match>
          );
        }
      })}
    </Switch>
  );
}
