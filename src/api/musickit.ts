export const togglePlayPause = () => {
  if (MusicKit.getInstance().isPlaying) {
    MusicKit.getInstance().pause();
  } else {
    MusicKit.getInstance().play();
  }
};

export const play = () => {
  MusicKit.getInstance().play();
};

export const pause = () => {
  MusicKit.getInstance().pause();
};

export const setQueue = (
  type: string,
  id: string,
  startPlaying: boolean = false,
  startWith: number = 0,
) => {
  MusicKit.getInstance().setQueue({
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
