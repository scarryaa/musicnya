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
  return artists.split("& ").map((artist) => artist.trim());
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
