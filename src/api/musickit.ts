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

export const play = async () => {
  await MusicKit.getInstance().play();
};

export const stop = async () => {
  await MusicKit.getInstance().stop();
};

export const pause = () => {
  MusicKit.getInstance().pause();
};

export const setQueue = async (
  type: string,
  id: string | string[],
  startPlaying: boolean = false,
  startWith: number = 0
) => {
  await MusicKit.getInstance().setQueue({
    [type]: id,
    startPlaying,
    startWith
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

export const getLyrics = async () => {
  const instance: MusicKit.MusicKitInstance = MusicKit.getInstance();
  let songID: string | undefined;

  if (!instance) return;
  else {
    songID = instance.nowPlayingItem?._songId;
    if (songID?.startsWith("i.")) {
      return "Lyrics not available for this song.";
    }
  }

  if (!songID) return "";
  const response: MusicKit.APIResponseObject = await fetch(
    `https://amp-api.music.apple.com/v1/catalog/${instance.storefrontId}/songs/${songID}/lyrics`,
    {
      headers: {
        authorization: `Bearer ${instance.developerToken}`,
        "music-user-token": instance.musicUserToken
      }
    }
  ).then(async (response) => {
    return await (response.json() as Promise<MusicKit.APIResponseObject>);
  });

  const ttml: string = (response.data as any)?.[0]?.attributes.ttml;
  return ttml;
};
