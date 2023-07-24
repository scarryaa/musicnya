import { FastAverageColor } from "fast-average-color";
import {
  currentMediaItem,
  isPlaying,
  setCurrentMediaItem,
  setIsPlaying,
  setPlaybackDuration,
  setPlaybackTime,
} from "../stores/store";

export const replaceSrc = (
  src: string | undefined,
  size: number,
  format = "webp",
) => {
  if (src === undefined) return;
  return src
    .replace("{w}x{h}", `${size}x${size}`)
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
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

export const setupEvents = () => {
  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackStateDidChange,
    () => {
      setIsPlaying({ value: MusicKit.getInstance().isPlaying });
      console.log(isPlaying);
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.nowPlayingItemDidChange,
    () => {
      setCurrentMediaItem(MusicKit.getInstance().nowPlayingItem || {});
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queueItemsDidChange,
    () => {
      console.log("queueItemsDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queuePositionDidChange,
    () => {
      console.log("queuePositionDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.mediaItemStateDidChange,
    () => {
      console.log("mediaItemStateDidChange");
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackDurationDidChange,
    () => {
      setPlaybackDuration({
        value: MusicKit.getInstance().currentPlaybackDuration,
      });
    },
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackTimeDidChange,
    () => {
      setPlaybackTime({
        value: MusicKit.getInstance().currentPlaybackTime,
      });
    },
  );
};
