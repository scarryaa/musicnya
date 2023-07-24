import { For, JSX, Match, Switch } from "solid-js";
import { MediaTile } from "../MediaTile/MediaTile";
import { replaceSrc } from "../../util/utils";
import { MediaShelf } from "../MediaShelf/MediaShelf";
import { MediaTileLarge } from "../MediaTileLarge/MediaTileLarge";
import { MediaTileGlass } from "../MediaTileGlass/MediaTileGlass";
import { LinkSet } from "../LinkSet/LinkSet";
import { EditorialTile } from "../EditorialTile/EditorialTile";
import { VideoTile } from "../VideoTile/VideoTile";

export type MediaSelectorProps = {
  children: any;
  class?: string;
  title?: string;
  type: MusicKit.MediaItemType;
  displayKind: string;
  editorialElementKind?: string;
  links: {
    title: string;
    url: string;
  }[];
  artistId: string;
};

interface ComponentProps {
  id: string;
  mediaArt: MusicKit.Artwork;
  type: MusicKit.MediaItemType;
  title: string;
  artists: string[];
  children?: JSX.Element[];
  artistIds: string[];
}

interface ExtraData {
  artistKey?: string;
}

const LinkFactory = () => {
  return (props: MediaSelectorProps) => {
    return (
      <LinkSet
        links={props?.links?.map((item: any) => ({
          label: item?.label,
          url: item?.url,
        }))}
      />
    );
  };
};

const renderComponentSwitch = (props: MediaSelectorProps) => {
  const childType = props?.children?.[0].type;
  console.log(childType);

  return (
    <Switch fallback={<div>Something went wrong.</div>}>
      <Match when={childType === "albums"}>
        {MediaComponents["albums"](props)}
      </Match>
      <Match when={childType === "library-albums"}>
        {MediaComponents["library-albums"](props)}
      </Match>
      <Match when={childType === "playlists"}>
        {MediaComponents["playlists"](props)}
      </Match>
      <Match when={childType === "library-playlists"}>
        {MediaComponents["library-playlists"](props)}
      </Match>
      <Match when={childType === "songs"}>
        {MediaComponents["songs"](props)}
      </Match>
      <Match when={childType === "music-videos"}>
        {MediaComponents["music-videos"](props)}
      </Match>
      <Match when={childType === "uploaded-videos"}>
        {MediaComponents["uploaded-videos"](props)}
      </Match>
      <Match when={childType === "artists"}>
        {MediaComponents["artists"](props)}
      </Match>
      <Match when={childType === "stations"}>
        {MediaComponents["stations"](props)}
      </Match>
      <Match when={childType === "apple-curators"}>
        {MediaComponents["apple-curators"](props)}
      </Match>
    </Switch>
  );
};

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
              artistIds={item.relationships?.artists?.data?.map(
                (artist: any) => artist.id,
              )}
              id={item?.id}
              mediaArt={{
                ...(item.attributes.artwork ||
                  item.relationships?.contents?.data?.[0]?.attributes?.artwork),
                url: replaceSrc(
                  item.relationships?.contents?.data?.[0]?.relationships?.events
                    ?.data?.[0]?.attributes?.heroArtwork?.url ||
                    item.relationships?.contents?.data?.[0]?.attributes
                      ?.editorialArtwork?.subscriptionHero?.url ||
                    item?.attributes?.artwork?.url ||
                    item.relationships?.contents?.data?.[0]?.attributes?.artwork
                      .url,
                  item.relationships?.contents?.data?.[0]?.attributes
                    ?.editorialArtwork?.subscriptionHero?.height ||
                    item?.attributes?.artwork?.height ||
                    item.relationships?.contents?.data?.[0]?.attributes?.artwork
                      .height / 2 ||
                    300,
                ),
              }}
              type={item?.type}
              title={item?.attributes?.name || item?.attributes?.designTag}
              artists={item.relationships?.artists?.data?.map(
                (artist: any) => artist.attributes.name,
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
        props.children[0]?.attributes?.plainEditorialNotes?.standard ||
        props.children[0]?.attributes?.name
      }
      mediaArt={{
        ...props.children[0]?.attributes?.artwork,
        url: replaceSrc(
          props.children[0]?.attributes?.artwork?.url ||
            props.children[0]?.attributes?.editorialArtwork?.subscriptionHero
              .url,
          props.children[0]?.attributes?.artwork?.height ||
            props.children[0]?.attributes?.editorialArtwork?.subscriptionHero
              .height,
        ),
      }}
    />
  ),
  316: MediaComponentFactory(EditorialTile),
  322: LinkFactory(),
  326: (props: MediaSelectorProps) => renderComponentSwitch(props),
  327: MediaComponentFactory(MediaTile),
  // recently played on radio page
  332: () => null,
  336: MediaComponentFactory(MediaTile),
  385: MediaComponentFactory(EditorialTile),
  391: LinkFactory(),
  394: MediaComponentFactory(EditorialTile),
  488: () => null,
  "editorial-elements": MediaComponentFactory(EditorialTile),
  "personal-recommendation": (props: MediaSelectorProps) =>
    renderComponentSwitch(props),
  albums: MediaComponentFactory(MediaTile),
  "library-albums": MediaComponentFactory(MediaTile),
  playlists: MediaComponentFactory(MediaTile),
  songs: MediaComponentFactory(MediaTile),
  "music-videos": MediaComponentFactory(VideoTile),
  "uploaded-videos": MediaComponentFactory(VideoTile),
  artists: MediaComponentFactory(MediaTile),
  stations: MediaComponentFactory(MediaTile),
  "apple-curators": MediaComponentFactory(MediaTile),
  "library-playlists": MediaComponentFactory(MediaTile),
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
              {MediaComponents?.[key]?.(props)}
            </Match>
          );
        }
      })}
    </Switch>
  );
}
