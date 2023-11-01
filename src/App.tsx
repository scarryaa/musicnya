import { Show, type Component, createSignal, createEffect } from "solid-js";
import * as config from "../config.json";
import { Drawer } from "./components/Drawer/Drawer";
import { Titlebar, TitlebarMac } from "./components/Titlebar/Titlebar";
import { Main } from "./components/Main/Main";
import { setupEvents } from "./util/utils";
import { Lyrics } from "./components/Lyrics/Lyrics";
import { rightPanelContent, rightPanelOpen } from "./stores/store";
import { Queue } from "./components/Queue/Queue";
import { currentMediaItem } from "../src/stores/store";
import { Player } from "./components/Player/Player";
import { addUser } from "./util/firebase";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import { LibraryAddBanner } from "./components/LibraryAddingBanner/LibraryAddBanner";

export let cutToken: string;
export let userToken: string;

const [libraryAddedVisible, setLibraryAddedVisible] = createSignal(true);
const [libraryAdded, setLibraryAdded] = createSignal(false);

console.log(navigator.platform);

const firebaseConfig = {
  apiKey: config.FireBase.apiKey,
  authDomain: config.FireBase.authDomain,
  projectId: config.FireBase.projectId,
  storageBucket: config.FireBase.storageBucket,
  messagingSenderId: config.FireBase.messagingSenderId,
  appId: config.FireBase.appId,
  measurementId: config.FireBase.measurementId
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const App: Component = () => {
  // Check if user is logged in
  const [isAuthorized, setIsAuthorized] = createSignal(false);

  // Initialize MusicKit
  MusicKit.configure({
    developerToken: config.MusicKit.token,
    app: {
      name: "Music",
      build: "1.0.0"
    },
    sourceType: 24
  })
    .then((music) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      userToken = music.musicUserToken;
      cutToken = userToken.slice(-20);

      window.api.send("musickit-loaded");
    })
    .catch((err) => {
      console.log(err);
    });

  createEffect(async () => {
    await addUser().then(() => {
      console.log("Added user");
      setLibraryAdded(true);
      setLibraryAddedVisible(false);
    });
  });

  return (
    <div>
      <Show when={navigator.platform === "MacIntel"}>
        <TitlebarMac />
      </Show>
      <Show when={navigator.platform !== "MacIntel"}>
        <Titlebar />
      </Show>
      <Show when={libraryAddedVisible()}>
        <LibraryAddBanner />
      </Show>
      <div
        id="apple-music-video-container"
        style="position: absolute; z-index: 9999999999"
      ></div>
      <Drawer />
      <Show when={rightPanelContent.value === "lyrics" && rightPanelOpen}>
        <Lyrics />
      </Show>
      <Show when={rightPanelContent.value === "queue" && rightPanelOpen}>
        <Queue />
      </Show>
      <Show when={isAuthorized()}>
        <Main libraryAddedVisible={libraryAddedVisible()} />
      </Show>
      <Show when={currentMediaItem.id}>
        <Player />
      </Show>
      <ContextMenu />
    </div>
  );
};

export default App;
