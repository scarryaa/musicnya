import { Player } from "../Player/Player";
import styles from "./Main.module.scss";
import { Outlet } from "@solidjs/router";

export function Main() {
  return (
    <div class={styles.main}>
      <Outlet />
      <Player />
    </div>
  );
}
