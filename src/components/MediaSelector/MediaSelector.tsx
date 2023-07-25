import { For, JSX, Match, Switch, createMemo } from "solid-js";
import { MediaTile } from "../MediaTile/MediaTile";
import { replaceSrc } from "../../util/utils";
import { MediaShelf } from "../MediaShelf/MediaShelf";
import { MediaTileLarge } from "../MediaTileLarge/MediaTileLarge";
import { MediaTileGlass } from "../MediaTileGlass/MediaTileGlass";
import { LinkSet } from "../LinkSet/LinkSet";
import { EditorialTile } from "../EditorialTile/EditorialTile";
import { VideoTile } from "../VideoTile/VideoTile";
import { CuratorTile } from "../CuratorTile/CuratorTile";
import { EditorialTileLarge } from "../EditorialTileLarge/EditorialTileLarge";

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

type MediaComponentType =
  | "MusicNotesHeroShelf"
  | "MusicSuperHeroShelf"
  | "316"
  | "322"
  | "326"
  | "327"
  | "332"
  | "336"
  | "385"
  | "387"
  | "391"
  | "394"
  | "488"
  | "editorial-elements"
  | "personal-recommendation"
  | "albums"
  | "library-albums"
  | "playlists"
  | "songs"
  | "music-videos"
  | "uploaded-videos"
  | "artists"
  | "stations"
  | "apple-curators"
  | "library-playlists";

interface ComponentProps {
  id: string;
  badge: string;
  subtitle: string;
  mediaArt: MusicKit.Artwork;
  type: MusicKit.MediaItemType;
  title: string;
  artists: string[];
  children?: JSX.Element[];
  artistIds: string[];
}

const LinkFactory = () => {
  return (props: MediaSelectorProps) => {
    const LinkSetComputation = createMemo(() => {
      return (
        <LinkSet
          links={props?.links?.map((item: any) => ({
            label: item?.label,
            url: item?.url,
          }))}
        />
      );
    });

    return LinkSetComputation();
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

const componentCache = new Map();

const MediaComponentFactory = (
  ComponentType: (props: ComponentProps) => JSX.Element,
) => {
  if (componentCache.has(ComponentType)) {
    return componentCache.get(ComponentType);
  }

  const FactoryFunction = (props: MediaSelectorProps) => {
    return (
      <MediaShelf {...props}>
        <For each={props.children}>
          {(item) => {
            const artistIds = item.relationships?.artists?.data?.map(
              (artist: any) => artist.id,
            );
            const artistNames = item.relationships?.artists?.data?.map(
              (artist: any) => artist.attributes.name,
            );
            const title =
              item?.attributes?.designTag ||
              item?.attributes?.name ||
              item.relationships?.contents?.data?.[0]?.attributes?.name;
            const mediaArt = {
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
            };

            return (
              <ComponentType
                badge={item?.attributes?.designBadge}
                subtitle={
                  item.relationships?.contents?.data?.[0]?.attributes
                    ?.curatorName ||
                  item.relationships?.contents?.data?.[0]?.attributes
                    ?.artistName
                }
                artistIds={artistIds}
                id={item?.id}
                mediaArt={mediaArt}
                type={item?.type}
                title={title}
                artists={artistNames}
              />
            );
          }}
        </For>
      </MediaShelf>
    );
  };

  componentCache.set(ComponentType, FactoryFunction);
  return FactoryFunction;
};

const MediaComponents: Record<MediaComponentType, any> = {
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
          props.children[0]?.attributes?.plainEditorialCard?.[
            props.children[0]?.meta?.editorialCard
          ]?.editorialArtwork?.superHeroWide?.url ||
            props.children[0]?.attributes?.editorialArtwork?.subscriptionHero
              .url ||
            props.children[0]?.attributes?.artwork?.url,
          props.children[0]?.attributes?.plainEditorialCard?.[
            props.children[0]?.meta?.editorialCard
          ]?.editorialArtwork?.superHeroWide?.height ||
            props.children[0]?.attributes?.editorialArtwork?.subscriptionHero
              .height ||
            props.children[0]?.attributes?.artwork?.height,
        ),
      }}
    />
  ),
  316: MediaComponentFactory(EditorialTileLarge),
  322: LinkFactory(),
  326: (props: MediaSelectorProps) => renderComponentSwitch(props),
  327: MediaComponentFactory(MediaTile),
  // recently played on radio page
  332: () => null,
  336: MediaComponentFactory(MediaTile),
  385: MediaComponentFactory(EditorialTile),
  387: MediaComponentFactory(MediaTile),
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
  "apple-curators": MediaComponentFactory(CuratorTile),
  "library-playlists": MediaComponentFactory(MediaTile),
};

const sameComponentTypes: MediaComponentType[] = [
  "albums",
  "library-albums",
  "playlists",
  "songs",
  "artists",
  "stations",
  "library-playlists",
];

sameComponentTypes.forEach((type: MediaComponentType) => {
  MediaComponents[type] = MediaComponentFactory(MediaTile);
});

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
        const componentKey = key as MediaComponentType;
        if (isMediaComponentsKey(componentKey)) {
          return (
            <Match
              when={
                props.displayKind === componentKey ||
                props.editorialElementKind === componentKey ||
                props.type === componentKey
              }
            >
              {MediaComponents[componentKey]?.(props)}
            </Match>
          );
        }
      })}
    </Switch>
  );
}
