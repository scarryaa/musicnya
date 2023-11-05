/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./Lyrics.module.scss";
import { getLyrics } from "../../api/musickit";
import type { JSX } from "solid-js";

// eslint-disable-next-line prefer-const -- causes app bug??
let lyricsPane: HTMLPreElement = undefined as unknown as HTMLPreElement;
let parsedLyrics = [];
let currentLyricElement = null;

export const fetchLyrics = async (): Promise<void> => {
  const lyrics = await getLyrics();
  if (!lyrics) return;
  updateLyrics(lyrics);
};

const updateLyrics = (lyrics: any): void => {
  lyrics = stripHeaderInfo(lyrics);
  parsedLyrics = parseTTMLtoJS(lyrics);
  const pre = document.getElementById("lyrics");
  if (!pre) return;

  // Update the pre element with formatted lyrics
  pre.innerHTML = parsedLyrics
    .map((script, index) => {
      const linesHTML = script.lines
        .map(
          (line, lineIndex) =>
            `<span id="lyric-${index}-${lineIndex}" data-begin="${line.begin}" class="lyric-line">${line.text}</span><br/>`
        )
        .join("");
      return `<div id="script-${index}">${linesHTML}</div>`;
    })
    .join("");

  // Attach click event listeners to each lyric element
  pre.querySelectorAll(".lyric-line").forEach((lyric) => {
    lyric.addEventListener("click", onLyricClick);
  });

  // scroll to top
  setTimeout(() => {
    pre.scrollTop = 0;
  }, 0);

  syncLyrics(0);
};

const stripHeaderInfo = (lyrics: string): string => {
  // replace <metadata></metadata> with empty string
  const metadataRegex = /<metadata>.*?<\/metadata>/gs;
  const lyricsWithoutMetadata = lyrics.replace(metadataRegex, "");
  return lyricsWithoutMetadata;
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

function parseTTMLtoJS(ttmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(ttmlString, "text/xml");

  const divElements = xmlDoc.getElementsByTagName("div");
  const scriptArray = [];

  Array.from(divElements).forEach((div) => {
    const begin = div.getAttribute("begin");
    const end = div.getAttribute("end");

    const pElements = div.getElementsByTagName("p");
    const lines = [];

    Array.from(pElements).forEach((p) => {
      const lineBegin = p.getAttribute("begin");
      const lineEnd = p.getAttribute("end");
      const text = p.textContent;

      lines.push({
        begin: lineBegin,
        end: lineEnd,
        text: text.trim()
      });
    });

    scriptArray.push({
      begin: begin,
      end: end,
      lines: lines
    });
  });

  return scriptArray;
}

function timecodeToMs(timecode) {
  if (!timecode) return 0;
  const parts = timecode.split(":");
  const seconds = parts.pop();
  const minutes = parts.length > 0 ? parseInt(parts.pop(), 10) : 0;
  const hours = parts.length > 0 ? parseInt(parts.pop(), 10) : 0;

  // Split seconds and milliseconds
  const [secs, millis] = seconds.split(".");
  const totalSeconds = parseInt(secs, 10) + minutes * 60 + hours * 3600;
  const totalMillis = millis ? parseInt(millis, 10) : 0;

  return totalSeconds * 1000 + totalMillis;
}

function scrollToLyric(lyricIndex) {
  if (currentLyricElement) {
    currentLyricElement.classList.remove("active-lyric");
  }

  const lyricElement = document.getElementById("lyric-" + lyricIndex);

  if (lyricElement && lyricsPane) {
    lyricElement.classList.add("active-lyric");
    currentLyricElement = lyricElement;

    const lyricElementRect = lyricElement.getBoundingClientRect();
    const lyricsPaneRect = lyricsPane.getBoundingClientRect();

    const offset =
      lyricElementRect.top -
      lyricsPaneRect.top +
      lyricsPane.scrollTop -
      lyricsPaneRect.height / 2 +
      lyricElementRect.height / 2;

    lyricsPane.scroll({
      top: offset,
      behavior: "smooth"
    });
  }
}

export function syncLyrics(currentTimeMs) {
  for (let i = 0; i < parsedLyrics.length; i++) {
    const script = parsedLyrics[i];
    const beginTime = timecodeToMs(script.begin);
    const endTime = timecodeToMs(script.end);

    if (currentTimeMs >= beginTime && currentTimeMs <= endTime) {
      for (let j = 0; j < script.lines.length; j++) {
        const line = script.lines[j];
        const lineBeginTime = timecodeToMs(line.begin);
        const lineEndTime = timecodeToMs(line.end);
        if (currentTimeMs >= lineBeginTime && currentTimeMs <= lineEndTime) {
          scrollToLyric(`${i}-${j}`);
          break;
        }
      }
      break;
    }
  }
}

const onLyricClick = (event) => {
  const element = event.target;
  const timecode = element.dataset.begin;
  if (timecode) {
    const timeInMs = timecodeToMs(timecode);
    MusicKit.getInstance().seekToTime(timeInMs / 1000);
  }
};
