import { Show } from "solid-js";
import { mergeProps } from "solid-js/web";
import { Player } from "../Player/Player";
import styles from "./Main.module.scss";
import { Routes, Route, Outlet } from "@solidjs/router";
import { currentMediaItem, immersiveBackground } from "../../stores/store";
import { Home } from "../../pages/Home/Home";
import { useMusicKit } from "../../hooks/useMusickit";

export function Main(props) {
  // Using the hook to get the reactive nowPlayingItem
  const nowPlayingItem = useMusicKit();

  return (
    <div
      class={`${styles.main} ${
        props.libraryAddedVisible ? styles.mainLibraryAdded : ""
      }`}
      style={{
        "background-color":
          immersiveBackground.value && nowPlayingItem()
            ? "rgba(0, 0, 0, 0.5)"
            : "#202020"
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Outlet />
    </div>
  );
}
