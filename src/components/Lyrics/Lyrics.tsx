/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./Lyrics.module.scss";
import { getLyrics } from "../../api/musickit";
import type { JSX } from "solid-js";

// eslint-disable-next-line prefer-const -- causes app bug??
let lyricsPane: HTMLPreElement = undefined as unknown as HTMLPreElement;

export const fetchLyrics = async (): Promise<void> => {
  const lyrics = await getLyrics();
  updateLyrics(lyrics);
};

const updateLyrics = (lyrics: any): void => {
  const pre = document.getElementById("lyrics");
  if (!pre) return;
  pre.innerHTML = lyrics || "Start playing something!";

  // scroll to top
  setTimeout(() => {
    pre.scrollTop = 0;
  }, 0);
};

export function Lyrics(): JSX.Element {
  return (
    <div class={styles.lyrics}>
      <h1>Lyrics</h1>
      <pre ref={lyricsPane} id="lyrics">
        Start playing something!
      </pre>
    </div>
  );
}
