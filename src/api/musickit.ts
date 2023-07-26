export const togglePlayPause = () => {
  if (MusicKit.getInstance().isPlaying) {
    MusicKit.getInstance().pause();
  } else {
    MusicKit.getInstance().play();
  }
};

export const setAutoplay = (on: boolean) => {
  MusicKit.getInstance().autoplayEnabled = on;
  MusicKit.getInstance()._autoplayEnabled = on;
};

export const getQueueItems = () => {
  return MusicKit.getInstance().queue.items;
};

export const play = () => {
  MusicKit.getInstance().play();
};

export const stop = () => {
  MusicKit.getInstance().stop();
};

export const pause = () => {
  MusicKit.getInstance().pause();
};

export const setQueue = async (
  type: string,
  id: string | string[],
  startPlaying: boolean = false,
  startWith: number = 0,
) => {
  await MusicKit.getInstance().setQueue({
    [type]: id,
    startPlaying,
    startWith: startWith,
  });
};

export const skipToNextItem = () => {
  MusicKit.getInstance().skipToNextItem();
};

export const skipToPreviousItem = () => {
  MusicKit.getInstance().skipToPreviousItem();
};

export const adjustVolume = (volume: number) => {
  MusicKit.getInstance().volume = volume;
};

export const seekToTime = (time: number) => {
  MusicKit.getInstance().seekToTime(time);
};

export const setRepeatMode = (mode: MusicKit.PlayerRepeatMode) => {
  MusicKit.getInstance().repeatMode = mode;
};

export const setShuffleMode = (mode: MusicKit.PlayerShuffleMode) => {
  MusicKit.getInstance().shuffleMode = mode;
};
