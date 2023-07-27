import { Show } from "solid-js";
import { Player } from "../Player/Player";
import styles from "./Main.module.scss";
import { Outlet } from "@solidjs/router";
import { currentMediaItem } from "../../stores/store";

export function Main() {
  return (
    <div class={styles.main}>
      <Outlet />
      <Show when={currentMediaItem.id}>
        <Player />
      </Show>
    </div>
  );
}
