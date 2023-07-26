import styles from "./Lyrics.module.scss";
import { getLyrics } from "../../api/musickit";

let lyrics: any = undefined;

export const fetchLyrics = async () => {
  lyrics = await getLyrics();
  updateLyrics();
};

const updateLyrics = () => {
  const pre = document.getElementById("lyrics");
  if (!pre) return;
  pre.innerHTML = lyrics;
};

export function Lyrics() {
  return (
    <div class={styles.lyrics}>
      <h1>Lyrics</h1>
      <pre id="lyrics">Start playing something!</pre>
    </div>
  );
}
