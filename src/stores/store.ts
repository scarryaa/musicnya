import { createStore } from "solid-js/store";

export const [countryCode, setCountryCode] = createStore({ value: "us" });
export const [currentMediaItem, setCurrentMediaItem] = createStore(
  {} as MusicKit.MediaItem,
);

export const [isPlaying, setIsPlaying] = createStore({ value: false });
export const [volume, setVolume] = createStore({ value: 0.2 });
export const [oldVolume, setOldVolume] = createStore({ value: 0.2 });
export const [isShuffle, setIsShuffle] = createStore({ value: 0 });
export const [isRepeat, setIsRepeat] = createStore({ value: 0 });
export const [playbackDuration, setPlaybackDuration] = createStore({
  value: 0,
});
export const [playbackTime, setPlaybackTime] = createStore({
  value: 0,
});
