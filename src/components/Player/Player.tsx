import {
  BsPauseCircleFill,
  BsPlayCircleFill,
  BsRepeat,
  BsRepeat1,
  BsShuffle,
  BsStopCircleFill,
  BsVolumeDownFill,
  BsVolumeMuteFill,
  BsVolumeUpFill
} from "solid-icons/bs";
import styles from "./Player.module.scss";
import { BiRegularSkipNext, BiRegularSkipPrevious } from "solid-icons/bi";
import {
  currentMediaItem,
  darkMode,
  isPlaying,
  isRepeat,
  isShuffle,
  oldVolume,
  playbackDuration,
  playbackTime,
  setCurrentMediaItem,
  setIsRepeat,
  setIsShuffle,
  setOldVolume,
  setVolume,
  volume
} from "../../stores/store";
import { constructLink, formatTime, replaceSrc } from "../../util/utils";
import {
  adjustVolume,
  seekToTime,
  setRepeatMode,
  setShuffleMode,
  skipToNextItem,
  skipToPreviousItem,
  togglePlayPause
} from "../../api/musickit";
import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { Tooltip } from "../Tooltip/Tooltip";

export function Player() {
  const ButtonStyle = {
    size: 40,
    sizeSmall: 20,
    sizeVolume: 28,
    marginTop: "-0.25rem",
    marginLeft: "-0.1rem"
  };

  const getPlayButtonType = () => {
    if (currentMediaItem?.attributes?.kind === "streaming") {
      if (isPlaying.value) {
        return "stop";
      } else {
        return "play";
      }
    } else if (isPlaying.value) {
      return "pause";
    } else {
      return "play";
    }
  };

  const playButton = () => {
    switch (getPlayButtonType()) {
      case "stop":
        return (
          <Tooltip text="stop" position="top">
            <BsStopCircleFill
              fill={darkMode.value ? "white" : "black"}
              size={ButtonStyle.size}
              onclick={async () => {
                await MusicKit.getInstance().stop();
                setCurrentMediaItem({});
              }}
            />
          </Tooltip>
        );
      case "pause":
        return (
          <Tooltip text="pause" position="top">
            <BsPauseCircleFill
              fill={darkMode.value ? "white" : "black"}
              size={ButtonStyle.size}
              onclick={() => {
                togglePlayPause();
              }}
            />
          </Tooltip>
        );
      case "play":
        return (
          <Tooltip text="play" position="top">
            <BsPlayCircleFill
              fill={darkMode.value ? "white" : "black"}
              size={ButtonStyle.size}
              onclick={() => {
                togglePlayPause();
              }}
            />
          </Tooltip>
        );
    }
  };

  const getRepeatButtonType = () => {
    if (isRepeat.value === 0) {
      return "repeat";
    } else if (isRepeat.value === 1) {
      return "repeat1";
    } else {
      return "repeat";
    }
  };

  const repeatButton = () => {
    switch (getRepeatButtonType()) {
      case "repeat":
        return (
          <Tooltip
            text={isRepeat.value === 2 ? "repeat off" : "repeat one"}
            position="top"
          >
            <BsRepeat
              fill={darkMode.value ? "white" : "black"}
              style={{
                fill:
                  isRepeat.value === 1 || isRepeat.value === 2
                    ? "var(--accent)"
                    : darkMode.value
                    ? "white"
                    : "black"
              }}
              size={20}
              onclick={() => {
                setIsRepeat({
                  value: isRepeat.value === 0 ? 1 : isRepeat.value === 1 ? 2 : 0
                });
                setRepeatMode(
                  MusicKit.getInstance().repeatMode === (0 as any)
                    ? (1 as any)
                    : MusicKit.getInstance().repeatMode === (1 as any)
                    ? (2 as any)
                    : (0 as any)
                );
              }}
            />
          </Tooltip>
        );
      case "repeat1":
        return (
          <Tooltip text="repeat all" position="top">
            <BsRepeat1
              fill={darkMode.value ? "white" : "black"}
              style={{
                fill:
                  isRepeat.value === 1 || isRepeat.value === 2
                    ? "var(--accent)"
                    : "white"
              }}
              size={20}
              onclick={() => {
                setIsRepeat({
                  value: isRepeat.value === 0 ? 1 : isRepeat.value === 1 ? 2 : 0
                });
                setRepeatMode(
                  MusicKit.getInstance().repeatMode === (0 as any)
                    ? (1 as any)
                    : MusicKit.getInstance().repeatMode === (1 as any)
                    ? (2 as any)
                    : (0 as any)
                );
              }}
            />
          </Tooltip>
        );
    }
  };

  const getShuffleButtonType = () => {
    return "shuffle";
  };

  const shuffleButton = () => {
    switch (getShuffleButtonType()) {
      case "shuffle":
        return (
          <Tooltip text="shuffle" position="top">
            <BsShuffle
              fill={darkMode.value ? "white" : "black"}
              size={20}
              style={{
                fill:
                  isShuffle.value === 1
                    ? "var(--accent)"
                    : darkMode.value
                    ? "white"
                    : "black"
              }}
              onclick={() => {
                setIsShuffle({
                  value: isShuffle.value === 1 ? 0 : 1
                });
                setShuffleMode(
                  MusicKit.getInstance().shuffleMode === 1 ? 0 : 1
                );
                console.log(MusicKit.getInstance().queue.items);
              }}
            />
          </Tooltip>
        );
    }
  };

  const getVolumeButtonType = () => {
    if (volume.value > 0.5) {
      return "volumeUp";
    } else if (volume.value > 0) {
      return "volumeDown";
    } else {
      return "volumeMute";
    }
  };

  const volumeButton = () => {
    switch (getVolumeButtonType()) {
      case "volumeUp":
        return (
          <Tooltip text="mute" position="top">
            <BsVolumeUpFill
              fill={darkMode.value ? "white" : "black"}
              size={28}
              style={{ "margin-top": "-0.1rem", "margin-left": "-0.3rem" }}
              onclick={() => {
                setOldVolume({ value: volume.value });
                setVolume({ value: 0 });
                adjustVolume(0);
              }}
            />
          </Tooltip>
        );
      case "volumeDown":
        return (
          <Tooltip text="mute" position="top">
            <BsVolumeDownFill
              fill={darkMode.value ? "white" : "black"}
              size={28}
              style={{ "margin-top": "-0.1rem", "margin-left": "-0.3rem" }}
              onclick={() => {
                setOldVolume({ value: volume.value });
                setVolume({ value: 0 });
                adjustVolume(0);
              }}
            />
          </Tooltip>
        );
      case "volumeMute":
        return (
          <Tooltip text="unmute" position="top">
            <BsVolumeMuteFill
              fill={darkMode.value ? "white" : "black"}
              size={28}
              style={{ "margin-top": "-0.1rem", "margin-left": "-0.3rem" }}
              onclick={() => {
                setVolume({ value: oldVolume.value });
                adjustVolume(oldVolume.value);
                setOldVolume({ value: volume.value });
              }}
            />
          </Tooltip>
        );
    }
  };
  const formattedPlaybackTime = () => formatTime(playbackTime.value);
  const formattedPlaybackDuration = () => formatTime(playbackDuration.value);

  return (
    <div class={styles.player}>
      <div class={styles.player__left}>
        <img
          id="player-artwork"
          loading="lazy"
          decoding="async"
          class={styles.player__left__mediaArt}
          src={replaceSrc(currentMediaItem?.attributes?.artwork?.url, 150)}
          alt="Album Art"
          width={150}
          height={150}
          style={{ opacity: currentMediaItem.attributes ? 1 : 0 }}
        />
        <div class={styles.player__left__mediaInfo}>
          <A
            class={styles.player__left__mediaInfo__title}
            href={`${constructLink(
              currentMediaItem?._container?.type,
              currentMediaItem?._container?.id
            )}`}
          >
            {currentMediaItem?.attributes?.name}
          </A>
          <A
            class={styles.player__left__mediaInfo__artist}
            href={"/search/" + currentMediaItem?.attributes?.artistName}
          >
            {currentMediaItem?.attributes?.artistName}
          </A>
        </div>
      </div>
      <div class={styles.player__middle}>
        <div class={styles.player__middle__controls}>
          <button class={styles.player__left__controls__button}>
            <Tooltip text="previous" position="top">
              <BiRegularSkipPrevious
                fill={darkMode.value ? "white" : "black"}
                size={40}
                onclick={() => {
                  skipToPreviousItem();
                }}
              />
            </Tooltip>
          </button>
          <button class={styles.player__left__controls__button}>
            {playButton()}
          </button>
          <button class={styles.player__left__controls__button}>
            <Tooltip text="next" position="top">
              <BiRegularSkipNext
                fill={darkMode.value ? "white" : "black"}
                size={40}
                onclick={() => {
                  skipToNextItem();
                }}
              />
            </Tooltip>
          </button>
        </div>
        <div class={styles.player__middle__progress}>
          <Show when={currentMediaItem?.attributes?.kind !== "streaming"}>
            <div class={styles.player__middle__progress__time}>
              {formattedPlaybackTime()}
            </div>
          </Show>
          <input
            type="range"
            min="0"
            max={playbackDuration.value}
            value={playbackTime.value}
            class={styles.player__middle__progress__bar}
            onchange={(e) => {
              seekToTime(e.target.valueAsNumber);
            }}
          />
          <Show when={currentMediaItem?.attributes?.kind !== "streaming"}>
            <div class={styles.player__middle__progress__time}>
              {formattedPlaybackDuration()}
            </div>
          </Show>
        </div>
      </div>
      <div class={styles.player__right}>
        <button class={styles.player__button}>{shuffleButton()}</button>
        <button class={styles.player__button}>{repeatButton()}</button>
        <button class={styles.player__button}>{volumeButton()}</button>
        <div class={styles.player__right__volume}>
          <input
            type="range"
            min="0"
            max="100"
            value={volume.value * 100}
            class={styles.player__right__volume__bar}
            oninput={(e) => {
              setVolume({ value: e.target.valueAsNumber / 100 });
              adjustVolume(e.target.valueAsNumber / 100);
            }}
          />
        </div>
      </div>
    </div>
  );
}
