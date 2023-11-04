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
  // Parse the TTML string using DOMParser
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(ttmlString, "text/xml");

  // Get all the <div> elements from the TTML
  const divElements = xmlDoc.getElementsByTagName("div");
  const scriptArray = [];

  // Iterate over each <div> element
  Array.from(divElements).forEach((div) => {
    // Extract the begin and end attributes
    const begin = div.getAttribute("begin");
    const end = div.getAttribute("end");

    // Get all <p> elements within this <div>
    const pElements = div.getElementsByTagName("p");
    const lines = [];

    // Iterate over each <p> element to get the lyrics and timings
    Array.from(pElements).forEach((p) => {
      const lineBegin = p.getAttribute("begin");
      const lineEnd = p.getAttribute("end");
      const text = p.textContent;

      lines.push({
        begin: lineBegin,
        end: lineEnd,
        text: text.trim() // Trim the text to remove any whitespace
      });
    });

    // Add the constructed object to the scriptArray
    scriptArray.push({
      begin: begin,
      end: end,
      lines: lines
    });
  });

  return scriptArray;
}

function timecodeToMs(timecode) {
  const parts = timecode.split(":");
  const seconds = parts.pop(); // get seconds and ms
  const minutes = parts.length > 0 ? parseInt(parts.pop(), 10) : 0; // get minutes or 0 if none
  const hours = parts.length > 0 ? parseInt(parts.pop(), 10) : 0; // get hours or 0 if none

  // Split seconds and milliseconds
  const [secs, millis] = seconds.split(".");
  const totalSeconds = parseInt(secs, 10) + minutes * 60 + hours * 3600;
  const totalMillis = millis ? parseInt(millis, 10) : 0;

  return totalSeconds * 1000 + totalMillis;
}

function scrollToLyric(lyricIndex) {
  // If there's an active lyric, remove the class from it
  if (currentLyricElement) {
    currentLyricElement.classList.remove("active-lyric");
  }

  // Get the new active lyric element
  const lyricElement = document.getElementById("lyric-" + lyricIndex);

  if (lyricElement && lyricsPane) {
    // Add the active class to the new active lyric
    lyricElement.classList.add("active-lyric");
    currentLyricElement = lyricElement; // Update the current active lyric

    // Calculate the offset to center the lyric in the container
    const lyricElementRect = lyricElement.getBoundingClientRect();
    const lyricsPaneRect = lyricsPane.getBoundingClientRect();

    // Calculate the offset to center the lyric in the container
    const offset =
      lyricElementRect.top -
      lyricsPaneRect.top +
      lyricsPane.scrollTop -
      lyricsPaneRect.height / 2 +
      lyricElementRect.height / 2;

    // Scroll the container to the calculated offset
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
