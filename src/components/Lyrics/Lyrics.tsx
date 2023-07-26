import styles from "./Lyrics.module.scss";
import { getLyrics } from "../../api/musickit";

let lyrics: any = undefined;
let lyricsPane: HTMLPreElement = undefined as unknown as HTMLPreElement;

export const fetchLyrics = async () => {
  lyrics = await getLyrics();
  updateLyrics();
};

const updateLyrics = () => {
  const pre = document.getElementById("lyrics");
  if (!pre) return;
  pre.innerHTML = lyrics;

  // scroll to top
  setTimeout(() => {
    pre.scrollTop = 0;
  }, 5000);
};

export function Lyrics() {
  return (
    <div class={styles.lyrics}>
      <h1>Lyrics</h1>
      <pre ref={lyricsPane} id="lyrics">
        Start playing something!
      </pre>
    </div>
  );
}
