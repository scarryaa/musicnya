import styles from "./Lyrics.module.scss";
import { getLyrics } from "../../api/musickit";
let lyrics;

export const fetchLyrics = async () => {
  if (MusicKit.getInstance().isPlaying) {
    lyrics = await getLyrics();
    console.log(lyrics);
    updateLyrics();
  }
};

const updateLyrics = () => {
  const pre = document.getElementById("lyrics");
  pre.innerHTML = lyrics;
};

export function Lyrics() {
  return (
    <div class={styles.lyrics}>
      <h1>Lyrics</h1>
      {/*  */}
      <button onclick={async () => await fetchLyrics()}>Get Lyrics</button>
      <pre id="lyrics">Start playing something!</pre>
    </div>
  );
}
