/* @refresh reload */
import { render } from "solid-js/web";

import "./styles/index.scss";
import "./styles/_fonts.scss";
import App from "./App";
import { Route, Router, Routes } from "@solidjs/router";
import { Home } from "./pages/Home/Home";
import { Browse } from "./pages/Browse/Browse";
import { Radio } from "./pages/Radio/Radio";
import { Settings } from "./pages/Settings/Settings";
import { NotFound } from "./pages/NotFound/NotFound";
import { Songs } from "./pages/Library/Songs/Songs";
import { Playlists } from "./pages/Library/Playlists/Playlists";
import { Albums } from "./pages/Library/Albums/Albums";
import { Artists } from "./pages/Library/Artists/Artists";
import { Artist } from "./pages/Artist/Artist";
import { Album } from "./pages/Album/Album";
import { Playlist } from "./pages/Playlist/Playlist";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={App}>
          <Route path="/home" component={Home} />
          <Route path="/browse" component={Browse} />
          <Route path="/radio" component={Radio} />
          <Route path="/settings" component={Settings} />
          <Route path="/library/songs" component={Songs} />
          <Route path="/library/playlists" component={Playlists} />
          <Route path="/library/albums" component={Albums} />
          <Route path="/library/artists" component={Artists} />
          <Route path="/library/album/:id" component={Album} />
          <Route path="/library/artist/:id" component={Artist} />
          <Route path="/library/playlist/:id" component={Playlist} />
          <Route path="/artist/:id" component={Artist} />
          <Route path="/album/:id" component={Album} />
          <Route path="/playlist/:id" component={Playlist} />
          <Route path="*" component={NotFound} />
        </Route>
      </Routes>
    </Router>
  ),
  root!,
);
