/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FastAverageColor } from "fast-average-color";
import {
  isPlaying,
  setCurrentMediaItem,
  setIsPlaying,
  setPlaybackDuration,
  setPlaybackTime
} from "../stores/store";
import { fetchLyrics } from "../components/Lyrics/Lyrics";

export const replaceSrc = (
  src: string | undefined,
  width: number,
  height: number = width,
  format = "webp"
): string | undefined => {
  if (src === undefined) return;
  return src
    .replace("{w}x{h}", `${Math.floor(width)}x${Math.floor(height)}`)
    .replace("{f}", format)
    .replace("{c}", "");
};

export const splitArtists = (artists: string): string[] => {
  if (artists === undefined) return [];
  return artists.split("&").map((artist) => artist.trim());
};

export const getArtworkColor = async (src: string): Promise<string> => {
  const fac = new FastAverageColor();
  const color = fac.getColorAsync(src);
  return await color.then((color) => color.hex);
};

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60).toFixed(0);
  return `${minutes}:${seconds.length === 1 ? "0" + seconds : seconds}`;
};

export const constructLink = (type: string, id: string): string => {
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

var startTime: number;

// data functions

export const getNestedData = (data: any): any => {
  // data?.data[0]
  return data?.data?.[0];
};

export const getNestedAttributes = (data: any): any => {
  // data?.data[0]?.attributes
  return getNestedData(data)?.attributes;
};

export const getNestedRelationships = (data: any): any => {
  // data?.data[0]?.relationships
  return getNestedData(data)?.relationships;
};

export const getNestedArtwork = (data: any): any => {
  // data?.data[0]?.attributes?.artwork
  return getNestedAttributes(data)?.artwork;
};

export const getNestedEditorialArtwork = (data: any): any => {
  // data?.data[0]?.attributes?.editorialArtwork
  return getNestedAttributes(data)?.editorialArtwork;
};

export const getNestedPlainEditorialNotes = (data: any): any => {
  // data?.data[0]?.attributes?.plainEditorialNotes
  return getNestedAttributes(data)?.plainEditorialNotes;
};

export const getNestedTabsData = (data: any): any => {
  // data?.data[0]?.relationships?.tabs?.data
  return getNestedRelationships(data)?.tabs?.data[0];
};

export const getNestedTabsRelationshipsData = (data: any): any => {
  // data?.data[0]?.relationships?.tabs?.data[0]?.relationships?.children?.data
  return getNestedTabsData(data)?.relationships.children?.data;
};

export const getNestedGroupingData = (data: any): any => {
  // data?.data[0]?.relationships?.grouping?.data
  return getNestedRelationships(data)?.grouping?.data;
};

export const getNestedGroupingRelationshipsData = (data: any): any => {
  // data?.data[0]?.relationships?.groupings?.data[0]?.relationships?.contents?.data
  return getNestedGroupingData(data)?.relationships.contents?.data;
};

export const getItemAttributes = (item: any): any => {
  // item?.attributes
  return item?.attributes;
};

export const getItemRelationships = (item: any): any => {
  // item?.relationships
  return item?.relationships;
};

export const getMultiplexTarget = (data: any): any => {
  // data?.results?.target
  return data?.results?.target;
};

export const getAlbumIdFromUrl = (url: string): string => {
  if (url === undefined) return "";

  const splitUrl = url.split("/");
  return splitUrl[splitUrl.length - 1];
};

export const extractTileId = (link: string, id: string): string => {
  return (
    link
      ?.toLowerCase()
      ?.split("/")
      ?.pop()
      ?.split("id=")
      ?.pop()
      ?.replace("?pp=", "")
      ?.replace("&mt=1", "") ?? id
  );
};

export const setupEvents = (): void => {
  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackStateDidChange as unknown as string,
    () => {
      setIsPlaying({ value: MusicKit.getInstance().isPlaying });

      startTime = Date.now();

      // Discord RPC
      if (isPlaying.value) {
        window.api.send("set-activity", {
          details:
            MusicKit.getInstance().nowPlayingItem?.title +
            " - " +
            MusicKit.getInstance().nowPlayingItem?.albumName,
          state: MusicKit.getInstance().nowPlayingItem?.artistName,
          largeImageKey:
            MusicKit.getInstance().nowPlayingItem?.artwork?.url.replace(
              "{w}x{h}",
              "512x512"
            ),
          largeImageText: MusicKit.getInstance().nowPlayingItem?.albumName,
          instance: false,
          startTimestamp: Date.now(),
          endTimestamp:
            Date.now() +
            MusicKit.getInstance().currentPlaybackDuration * 1000 -
            MusicKit.getInstance().currentPlaybackTime * 1000
        });
      } else {
        window.api.send("clear-activity", {
          instance: false
        });
      }

      // MPRIS
      if (isPlaying.value) {
        window.api.send("play");
      } else {
        window.api.send("pause");
      }
    }
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.nowPlayingItemDidChange as unknown as string,
    () => {
      setCurrentMediaItem(MusicKit.getInstance().nowPlayingItem ?? {});
      void fetchLyrics();

      // @ts-expect-error ts-migrate allow overlapping types
      if (MusicKit.getInstance().nowPlayingItem?.type === "musicVideo") {
        const videoContainer = document.getElementById(
          "apple-music-video-container"
        )!;

        const videoPlayer = document.getElementById(
          "apple-music-video-player"
        )! as HTMLVideoElement;

        const videoCloseBtn = document.getElementById(
          "apple-music-video-close-btn"
        )!;

        const playerArtwork = document.getElementById(
          "player-artwork"
        )! as HTMLImageElement;

        videoContainer.style.display = "block";
        videoContainer.style.background = "black";
        videoPlayer.style.width = "100%";
        videoPlayer.style.height = "100%";
        videoPlayer.style.maxHeight = "100%";
        videoCloseBtn.style.display = "block";
        playerArtwork.style.opacity = "0";
        playerArtwork.src = "";
      } else {
        const videoContainer = document.getElementById(
          "apple-music-video-container"
        )!;

        const videoCloseBtn = document.getElementById(
          "apple-music-video-close-btn"
        )!;

        const playerArtwork = document.getElementById(
          "player-artwork"
        )! as HTMLImageElement;

        videoContainer.style.display = "none";
        videoCloseBtn.style.display = "none";
        playerArtwork.style.opacity = "1";
      }

      if (MusicKit.getInstance().nowPlayingItem !== undefined) {
        // Discord RPC
        window.api.send("set-activity", {
          details:
            MusicKit.getInstance().nowPlayingItem?.title +
            " - " +
            MusicKit.getInstance().nowPlayingItem?.albumName,
          state: MusicKit.getInstance().nowPlayingItem?.artistName,
          largeImageKey:
            MusicKit.getInstance().nowPlayingItem?.artwork?.url.replace(
              "{w}x{h}",
              "512x512"
            ),
          largeImageText: MusicKit.getInstance().nowPlayingItem?.albumName,
          instance: false,
          startTimestamp: startTime,
          endTimestamp:
            Date.now() + MusicKit.getInstance().currentPlaybackDuration * 1000
        });
      }
    }
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queueItemsDidChange as string,
    () => {
      console.log("queueItemsDidChange");
      void fetchLyrics();
    }
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.queuePositionDidChange as string,
    () => {
      console.log("queuePositionDidChange");
    }
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.mediaItemStateDidChange as string,
    () => {
      console.log("mediaItemStateDidChange");
    }
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackDurationDidChange as string,
    () => {
      setPlaybackDuration({
        value: MusicKit.getInstance().currentPlaybackDuration
      });
    }
  );

  MusicKit.getInstance().addEventListener(
    MusicKit.Events.playbackTimeDidChange as string,
    () => {
      setPlaybackTime({
        value: MusicKit.getInstance().currentPlaybackTime
      });

      // MPRIS
      window.api.send("mpris-update-data", {
        attributes: {
          playParams: {
            id: MusicKit.getInstance().nowPlayingItem?.playParams.id
          },
          durationInMillis: MusicKit.getInstance().currentPlaybackDuration,
          artwork: {
            url: MusicKit.getInstance().nowPlayingItem?.artwork.url
          },
          name: MusicKit.getInstance().nowPlayingItem?.title,
          albumName: MusicKit.getInstance().nowPlayingItem?.albumName,
          artistName: MusicKit.getInstance().nowPlayingItem?.artistName,
          genreNames: MusicKit.getInstance().nowPlayingItem?.genreNames
        }
      });
    }
  );

  window.api.receive("mpris-play", () => {
    MusicKit.getInstance().play();
  });

  window.api.receive("mpris-pause", () => {
    MusicKit.getInstance().pause();
  });

  window.api.receive("mpris-stop", () => {
    MusicKit.getInstance().stop();
  });

  window.api.receive("mpris-next", () => {
    MusicKit.getInstance().skipToNextItem();
  });

  window.api.receive("mpris-previous", () => {
    MusicKit.getInstance().skipToPreviousItem();
  });
};
