import { Show, type Component } from "solid-js";

import { Drawer } from "./components/Drawer/Drawer";
import { Titlebar } from "./components/Titlebar/Titlebar";
import { Main } from "./components/Main/Main";
import { setupEvents } from "./util/utils";
import { Lyrics } from "./components/Lyrics/Lyrics";
import { rightPanelContent, rightPanelOpen } from "./stores/store";
import { Queue } from "./components/Queue/Queue";
import { Navigate } from "@solidjs/router";

const App: Component = () => {
  // Check if user is logged in

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
      });

      setupEvents();
      music.volume = 0.2;
      music.autoplayEnabled = true;
      music._autoplayEnabled = true;
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>
      <Titlebar />
      <Drawer />
      <Show when={rightPanelContent.value === "lyrics" && rightPanelOpen}>
        <Lyrics />
      </Show>
      <Show when={rightPanelContent.value === "queue" && rightPanelOpen}>
        <Queue />
      </Show>
      <Main />
    </div>
  );
};

export default App;
