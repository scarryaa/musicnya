import { createSignal, onCleanup } from "solid-js";
import { setAlbumColors, setCurrentAlbumArt } from "../stores/store";
import { FastAverageColor } from "fast-average-color";

export function useMusicKit() {
  const [nowPlayingItem, setNowPlayingItem] = createSignal(null);

  const updateNowPlayingItem = () => {
    // if no now playing item, retry after 1 second forever
    if (!MusicKit.getInstance().nowPlayingItem) {
      setTimeout(updateNowPlayingItem, 1000);
      return;
    }

    setNowPlayingItem(MusicKit.getInstance().nowPlayingItem);
  };

  const getAlbumArt = () => {
    const albumArt = nowPlayingItem()?.attributes?.artwork?.url?.replace(
      "{w}x{h}",
      "300x300"
    );

    // if no album art, retry after 1 second
    if (!albumArt) {
      setTimeout(getAlbumArt, 1000);
      return;
    }
    setCurrentAlbumArt({ value: albumArt });
  };

  const setupMusicKitEventListeners = () => {
    const musicKitInstance = MusicKit.getInstance();

    musicKitInstance.addEventListener(
      MusicKit.Events.mediaItemStateDidChange,
      getAlbumArt
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.mediaItemStateDidChange,
      updateNowPlayingItem
    );

    musicKitInstance.addEventListener(
      MusicKit.Events.playbackDurationDidChange,
      updateNowPlayingItem
    );

    getAlbumArt();

    updateNowPlayingItem();

    return () => {
      musicKitInstance.removeEventListener(
        MusicKit.Events.mediaItemStateDidChange,
        updateNowPlayingItem
      );
    };
  };

  onCleanup(setupMusicKitEventListeners());

  return nowPlayingItem;
}
