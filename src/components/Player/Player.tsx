import {
  BsPlayCircleFill,
  BsRepeat,
  BsShuffle,
  BsVolumeDownFill,
} from "solid-icons/bs";
import styles from "./Player.module.scss";
import { BiRegularSkipNext, BiRegularSkipPrevious } from "solid-icons/bi";

export function Player() {
  return (
    <div class={styles.player}>
      <div class={styles.player__left}>
        <img
          class={styles.player__left__albumArt}
          src="https://via.placeholder.com/150"
          alt="Album Art"
        />
        <div class={styles.player__left__songInfo}>
          <div class={styles.player__left__songInfo__title}>Song Title</div>
          <div class={styles.player__left__songInfo__artist}>Artist</div>
        </div>
        <div class={styles.player__left__controls}>
          <button class={styles.player__left__controls__button}>
            <BiRegularSkipPrevious fill="var(--text)" size={40} />
          </button>
          <button class={styles.player__left__controls__button}>
            <BsPlayCircleFill fill="var(--text)" size={40} />
          </button>
          <button class={styles.player__left__controls__button}>
            <BiRegularSkipNext fill="var(--text)" size={40} />
          </button>
        </div>
      </div>
      <div class={styles.player__middle}>
        <div class={styles.player__middle__progress}>
          <div class={styles.player__middle__progress__time}>0:00</div>
          <input
            type="range"
            min="0"
            max="100"
            value="50"
            class={styles.player__middle__progress__bar}
          />
          <div class={styles.player__middle__progress__time}>3:00</div>
        </div>
      </div>
      <div class={styles.player__right}>
        <button class="player__button">
          <BsShuffle fill="var(--text)" size={20} />
        </button>
        <button class="player__button">
          <BsRepeat fill="var(--text)" size={20} />
        </button>
        <BsVolumeDownFill
          class="player__button"
          fill="var(--text)"
          size={28}
          style="margin-top: -0.25rem; margin-left: -0.1rem;"
        />
        <div class={styles.player__right__volume}>
          <input
            type="range"
            min="0"
            max="100"
            value="50"
            class={styles.player__right__volume__bar}
          />
        </div>
      </div>
    </div>
  );
}
