import {
  BsPauseCircleFill,
  BsPlayCircleFill,
  BsRepeat,
  BsRepeat1,
  BsShuffle,
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

export function Player() {
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
              fill="var(--text)"
              size={40}
              onclick={() => skipToPreviousItem()}
            />
          </button>
          <button class={styles.player__left__controls__button}>
            {isPlaying.value ? (
              <BsPauseCircleFill
                fill="var(--text)"
                size={40}
                onclick={() => togglePlayPause()}
              />
            ) : (
              <BsPlayCircleFill
                fill="var(--text)"
                size={40}
                onclick={() => togglePlayPause()}
              />
            )}
          </button>
          <button class={styles.player__left__controls__button}>
            <BiRegularSkipNext
              fill="var(--text)"
              size={40}
              onclick={() => skipToNextItem()}
            />
          </button>
        </div>
        <div class={styles.player__middle__progress}>
          <div class={styles.player__middle__progress__time}>
            {formatTime(playbackTime.value)}
          </div>
          <input
            type="range"
            min="0"
            max={playbackDuration.value}
            value={playbackTime.value}
            class={styles.player__middle__progress__bar}
            onchange={(e) => seekToTime(e.target.valueAsNumber)}
          />
          <div class={styles.player__middle__progress__time}>
            {formatTime(playbackDuration.value)}
          </div>
        </div>
      </div>
      <div class={styles.player__right}>
        <button class={styles.player__button}>
          <BsShuffle
            fill="var(--text)"
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
        </button>
        <button class={styles.player__button}>
          {isRepeat.value === 1 ? (
            <BsRepeat1
              fill="var(--text)"
              style={{
                fill:
                  isRepeat.value === 1 || isRepeat.value === 2
                    ? "var(--accent)"
                    : "white",
              }}
              size={20}
              onclick={() => {
                setIsRepeat({
                  value:
                    isRepeat.value === 0 ? 1 : isRepeat.value === 1 ? 2 : 0,
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
          ) : (
            <BsRepeat
              fill="var(--text)"
              style={{
                fill:
                  isRepeat.value === 1 || isRepeat.value === 2
                    ? "var(--accent)"
                    : "white",
              }}
              size={20}
              onclick={() => {
                setIsRepeat({
                  value:
                    isRepeat.value === 0 ? 1 : isRepeat.value === 1 ? 2 : 0,
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
          )}
        </button>
        {volume.value > 0.5 ? (
          <BsVolumeUpFill
            class={styles.player__button}
            fill="var(--text)"
            size={28}
            style={{ "margin-top": "-0.25rem", "margin-left": "-0.1rem" }}
            onclick={() => {
              setOldVolume({ value: volume.value });
              setVolume({ value: 0 });
              adjustVolume(0);
            }}
          />
        ) : volume.value > 0 ? (
          <BsVolumeDownFill
            class={styles.player__button}
            fill="var(--text)"
            size={28}
            style={{ "margin-top": "-0.25rem", "margin-left": "-0.1rem" }}
            onclick={() => {
              setOldVolume({ value: volume.value });
              setVolume({ value: 0 });
              adjustVolume(0);
            }}
          />
        ) : (
          <BsVolumeMuteFill
            class={styles.player__button}
            fill="var(--text)"
            size={28}
            style={{ "margin-top": "-0.25rem", "margin-left": "-0.1rem" }}
            onclick={() => {
              setVolume({ value: oldVolume.value });
              adjustVolume(oldVolume.value);
              setOldVolume({ value: volume.value });
            }}
          />
        )}
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
