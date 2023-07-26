import styles from "./Titlebar.module.scss";
import { IoClose } from "solid-icons/io";
import { VsChromeMinimize, VsChromeMaximize } from "solid-icons/vs";

export function Titlebar() {
  return (
    <div class={styles.titlebar}>
      <button
        onclick={() => window.api.send("minimize-window")}
        class={styles["titlebar--button"]}
      >
        <VsChromeMinimize fill="#fff" size={12} />
      </button>
      <button
        onclick={() => window.api.send("maximize-window")}
        class={styles["titlebar--button"]}
      >
        <VsChromeMaximize fill="#fff" size={12} />
      </button>
      <button
        onclick={() => window.api.send("close-window")}
        class={styles["titlebar--button"]}
      >
        <IoClose fill="#fff" size={12} />
      </button>
    </div>
  );
}
