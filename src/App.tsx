import { Show, type Component, createSignal } from "solid-js";

import { Drawer } from "./components/Drawer/Drawer";
import { Titlebar, TitlebarMac } from "./components/Titlebar/Titlebar";
import { Main } from "./components/Main/Main";
import { setupEvents } from "./util/utils";
import { Lyrics } from "./components/Lyrics/Lyrics";
import { rightPanelContent, rightPanelOpen } from "./stores/store";
import { Queue } from "./components/Queue/Queue";
import { currentMediaItem } from "../src/stores/store";
import { Player } from "./components/Player/Player";

console.log(navigator.platform);

const App: Component = () => {
  // Check if user is logged in
  const [isAuthorized, setIsAuthorized] = createSignal(false);

  // Initialize MusicKit
  MusicKit.configure({
    developerToken: import.meta.env.VITE_MUSICKIT_TOKEN as string,
    app: {
      name: "Music",
      build: "1.0.0",
    },
    sourceType: 24,
  })
    .then((music) => {
      music.authorize().then(() => {
        console.log("Authorized");
        setIsAuthorized(true);
      });

      setupEvents();
      music.volume = 0.2;
      music.autoplayEnabled = true;
      music._autoplayEnabled = true;

      // Check for light or dark mode
      const lightTheme = localStorage.getItem("theme") === "light";
      if (lightTheme) {
        document.documentElement.setAttribute("theme", "light");
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>      
      <Show when={navigator.platform == 'MacIntel'}>
        <TitlebarMac />
      </Show>
      <Show when={navigator.platform != 'MacIntel'}>
        <Titlebar />
      </Show>
      <div id="apple-music-video-container" style="position: absolute; z-index: 9999999999"></div>
      <Drawer />
      <Show when={rightPanelContent.value === "lyrics" && rightPanelOpen}>
        <Lyrics />
      </Show>
      <Show when={rightPanelContent.value === "queue" && rightPanelOpen}>
        <Queue />
      </Show>
      <Show when={isAuthorized()}>
        <Main />
      </Show>
      <Show when={currentMediaItem.id}>
        <Player />
      </Show>
    </div>
  );
};

export default App;
