import {
  BsPauseCircleFill,
  BsPlayCircleFill,
  BsRepeat,
  BsRepeat1,
  BsShuffle,
  BsStopCircleFill,
  BsVolumeDownFill,
  BsVolumeMuteFill,
  BsVolumeUpFill,
} from "solid-icons/bs";
import styles from "./Player.module.scss";
import { BiRegularSkipNext, BiRegularSkipPrevious } from "solid-icons/bi";
import {
  currentMediaItem,
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
  volume,
} from "../../stores/store";
import { constructLink, formatTime, replaceSrc } from "../../util/utils";
import {
  adjustVolume,
  seekToTime,
  setRepeatMode,
  setShuffleMode,
  skipToNextItem,
  skipToPreviousItem,
  togglePlayPause,
} from "../../api/musickit";
import { A } from "@solidjs/router";
import { JSX, Show, createSignal } from "solid-js";

export function Player() {
  const ButtonStyle = {
    fill: "var(--text)",
    size: 40,
    sizeSmall: 20,
    sizeVolume: 28,
    marginTop: "-0.25rem",
    marginLeft: "-0.1rem",
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
          <BsStopCircleFill
            fill={ButtonStyle.fill}
            size={ButtonStyle.size}
            onclick={async () => {
              await MusicKit.getInstance().stop();
              setCurrentMediaItem({});
            }}
          />
        );
      case "pause":
        return (
          <BsPauseCircleFill
            fill={ButtonStyle.fill}
            size={ButtonStyle.size}
            onclick={() => togglePlayPause()}
          />
        );
      case "play":
        return (
          <BsPlayCircleFill
            fill={ButtonStyle.fill}
            size={ButtonStyle.size}
            onclick={() => togglePlayPause()}
          />
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
          <BsRepeat
            fill={ButtonStyle.fill}
            style={{
              fill:
                isRepeat.value === 1 || isRepeat.value === 2
                  ? "var(--accent)"
                  : "white",
            }}
            size={20}
            onclick={() => {
              setIsRepeat({
                value: isRepeat.value === 0 ? 1 : isRepeat.value === 1 ? 2 : 0,
              });
              setRepeatMode(
                MusicKit.getInstance().repeatMode === (0 as any)
                  ? (1 as any)
                  : MusicKit.getInstance().repeatMode === (1 as any)
                  ? (2 as any)
                  : (0 as any),
              );
            }}
          />
        );
      case "repeat1":
        return (
          <BsRepeat1
            fill={ButtonStyle.fill}
            style={{
              fill:
                isRepeat.value === 1 || isRepeat.value === 2
                  ? "var(--accent)"
                  : "white",
            }}
            size={20}
            onclick={() => {
              setIsRepeat({
                value: isRepeat.value === 0 ? 1 : isRepeat.value === 1 ? 2 : 0,
              });
              setRepeatMode(
                MusicKit.getInstance().repeatMode === (0 as any)
                  ? (1 as any)
                  : MusicKit.getInstance().repeatMode === (1 as any)
                  ? (2 as any)
                  : (0 as any),
              );
            }}
          />
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
          <BsShuffle
            fill={ButtonStyle.fill}
            size={20}
            style={{
              fill: isShuffle.value === 1 ? "var(--accent)" : "white",
            }}
            onclick={() => {
              setIsShuffle({
                value: isShuffle.value === 1 ? 0 : 1,
              });
              setShuffleMode(MusicKit.getInstance().shuffleMode === 1 ? 0 : 1);
              console.log(MusicKit.getInstance().queue.items);
            }}
          />
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
          <BsVolumeUpFill
            fill={ButtonStyle.fill}
            size={28}
            style={{ "margin-top": "-0.25rem", "margin-left": "-0.1rem" }}
            onclick={() => {
              setOldVolume({ value: volume.value });
              setVolume({ value: 0 });
              adjustVolume(0);
            }}
          />
        );
      case "volumeDown":
        return (
          <BsVolumeDownFill
            fill={ButtonStyle.fill}
            size={28}
            style={{ "margin-top": "-0.25rem", "margin-left": "-0.1rem" }}
            onclick={() => {
              setOldVolume({ value: volume.value });
              setVolume({ value: 0 });
              adjustVolume(0);
            }}
          />
        );
      case "volumeMute":
        return (
          <BsVolumeMuteFill
            fill={ButtonStyle.fill}
            size={28}
            style={{ "margin-top": "-0.25rem", "margin-left": "-0.1rem" }}
            onclick={() => {
              setVolume({ value: oldVolume.value });
              adjustVolume(oldVolume.value);
              setOldVolume({ value: volume.value });
            }}
          />
        );
    }
  };
  const formattedPlaybackTime = () => formatTime(playbackTime.value);
  const formattedPlaybackDuration = () => formatTime(playbackDuration.value);

  return (
    <div class={styles.player}>
      <div class={styles.player__left}>
        <img
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
              currentMediaItem?._container?.id,
            )}`}
          >
            {currentMediaItem?.attributes?.name}
          </A>
          {/* TODO implement search for artist */}
          <A class={styles.player__left__mediaInfo__artist} href="#">
            {currentMediaItem?.attributes?.artistName}
          </A>
        </div>
      </div>
      <div class={styles.player__middle}>
        <div class={styles.player__middle__controls}>
          <button class={styles.player__left__controls__button}>
            <BiRegularSkipPrevious
              fill={ButtonStyle.fill}
              size={40}
              onclick={() => skipToPreviousItem()}
            />
          </button>
          <button class={styles.player__left__controls__button}>
            {playButton()}
          </button>
          <button class={styles.player__left__controls__button}>
            <BiRegularSkipNext
              fill={ButtonStyle.fill}
              size={40}
              onclick={() => skipToNextItem()}
            />
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
            onchange={(e) => seekToTime(e.target.valueAsNumber)}
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
