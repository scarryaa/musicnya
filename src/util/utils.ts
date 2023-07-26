import { FastAverageColor } from "fast-average-color";
import {
  isPlaying,
  setCurrentMediaItem,
  setIsPlaying,
  setPlaybackDuration,
  setPlaybackTime,
} from "../stores/store";
import { fetchLyrics } from "../components/Lyrics/Lyrics";

export const replaceSrc = (
  src: string | undefined,
  width: number,
  height: number = width,
  format = "webp",
) => {
  if (src === undefined) return;
  return src
    .replace("{w}x{h}", `${Math.floor(width)}x${Math.floor(height)}`)
    .replace("{f}", format)
    .replace("{c}", "");
};

export const splitArtists = (artists: string) => {
  if (artists === undefined) return [];
  return artists.split("&").map((artist) => artist.trim());
};

export const getArtworkColor = (src: string) => {
  const fac = new FastAverageColor();
  const color = fac.getColorAsync(src);
  return color.then((color) => color.hex);
};

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60).toFixed(0);
  return `${minutes}:${seconds.length === 1 ? "0" + seconds : seconds}`;
};

export const constructLink = (type: string, id: string) => {
  if (id === undefined) return "";

  switch (type) {
    case "library-albums":
      return `/library/album/${id}`;
    case "library-artists":
      return `/library/artist/${id}`;
    case "library-playlists":
      return `/library/playlist/${id}`;
    case "albums":
      return `/album/${id}`;
    case "apple-curators":
      return `/curator/${id}`;
    case "artists":
      return `/artist/${id}`;
    case "playlists":
      return `/playlist/${id}`;
    case "songs":
    case "stations":
    case "library-songs":
    case "music-videos":
      return "";
    default:
      return "";
  }
};

// data functions

export const getNestedData = (data: any) => {
  // data?.data[0]
  return data?.data[0];
};

export const getNestedAttributes = (data: any) => {
  // data?.data[0]?.attributes
  return getNestedData(data)?.attributes;
};

export const getNestedRelationships = (data: any) => {
  // data?.data[0]?.relationships
  return getNestedData(data)?.relationships;
};

export const getNestedArtwork = (data: any) => {
  // data?.data[0]?.attributes?.artwork
  return getNestedAttributes(data)?.artwork;
};

export const getNestedEditorialArtwork = (data: any) => {
  // data?.data[0]?.attributes?.editorialArtwork
  return getNestedAttributes(data)?.editorialArtwork;
};

export const getNestedPlainEditorialNotes = (data: any) => {
  // data?.data[0]?.attributes?.plainEditorialNotes
  return getNestedAttributes(data)?.plainEditorialNotes;
};

export const getNestedTabsData = (data: any) => {
  // data?.data[0]?.relationships?.tabs?.data
  return getNestedRelationships(data)?.tabs?.data[0];
};

export const getNestedTabsRelationshipsData = (data: any) => {
  // data?.data[0]?.relationships?.tabs?.data[0]?.relationships?.children?.data
  return getNestedTabsData(data)?.relationships.children?.data;
};

export const getNestedGroupingData = (data: any) => {
  // data?.data[0]?.relationships?.grouping?.data
  return getNestedRelationships(data)?.grouping?.data;
};

export const getNestedGroupingRelationshipsData = (data: any) => {
  // data?.data[0]?.relationships?.groupings?.data[0]?.relationships?.contents?.data
  return getNestedGroupingData(data)?.relationships.contents?.data;
};

export const getItemAttributes = (item: any) => {
  // item?.attributes
  return item?.attributes;
};

export const getItemRelationships = (item: any) => {
  // item?.relationships
  return item?.relationships;
};

export const getMultiplexTarget = (data: any) => {
  // data?.results?.target
  return data?.results?.target;
};

export const getAlbumIdFromUrl = (url: string) => {
  if (url === undefined) return "";

  const splitUrl = url.split("/");
  return splitUrl[splitUrl.length - 1];
};

export const setupEvents = () => {
  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackStateDidChange as unknown as string,
    () => {
      setIsPlaying({ value: MusicKit.getInstance().isPlaying });
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.nowPlayingItemDidChange as unknown as string,
    () => {
      setCurrentMediaItem(MusicKit.getInstance().nowPlayingItem || {});
      fetchLyrics();
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queueItemsDidChange as string,
    () => {
      console.log("queueItemsDidChange");
      fetchLyrics();
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queuePositionDidChange as string,
    () => {
      console.log("queuePositionDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.mediaItemStateDidChange as string,
    () => {
      console.log("mediaItemStateDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackDurationDidChange as string,
    () => {
      setPlaybackDuration({
        value: MusicKit.getInstance().currentPlaybackDuration,
      });
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackTimeDidChange as string,
    () => {
      setPlaybackTime({
        value: MusicKit.getInstance().currentPlaybackTime,
      });
    },
  );
};
