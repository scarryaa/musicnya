import type { Component } from "solid-js";

import { Drawer } from "./components/Drawer/Drawer";
import { Titlebar } from "./components/Titlebar/Titlebar";
import { Main } from "./components/Main/Main";

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
    })
    .catch((err) => {
      console.log(err);
    });

  return (
    <div>
      <Titlebar />
      <Drawer />
      <Main />
    </div>
  );
};

export default App;
