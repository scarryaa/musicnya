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
        <VsChromeMinimize fill="var(--text)" size={12} />
      </button>
      <button
        onclick={() => window.api.send("maximize-window")}
        class={styles["titlebar--button"]}
      >
        <VsChromeMaximize fill="var(--text)" size={12} />
      </button>
      <button
        onclick={() => window.api.send("close-window")}
        class={styles["titlebar--button"]}
      >
        <IoClose fill="var(--text)" size={12} />
      </button>
    </div>
  );
}
export function TitlebarMac() {
  return (
    <div class={styles.titlebar} style={{ "justify-content": "flex-start" }}>
      <button
        onclick={() => window.api.send("close-window")}
        class={styles["titlebar--button"]}
        style={{ 
          "background-color": "#ff5f56", 
          "border-radius": "50%", 
          width: "12px", 
          height: "12px", 
          "margin-left": "8px", 
          "margin-right": "8px", 
          "line-height": "20px" 
        }}
      >
      </button>
      <button
        onclick={() => window.api.send("minimize-window")}
        class={styles["titlebar--button"]}
        style={{ 
          "background-color": "#ffbd2e", 
          "border-radius": "50%", 
          width: "12px", 
          height: "12px", 
          "margin-right": "8px", 
          "line-height": "20px" 
        }}
      >
      </button>
      <button
        onclick={() => window.api.send("maximize-window")}
        class={styles["titlebar--button"]}
        style={{ 
        "background-color": "#28c940",           
        "border-radius": "50%", 
        width: "12px", 
        height: "12px", 
        "margin-right": "8px", 
        "line-height": "20px" 
      }}
      >
      </button>

    </div>
    
  );
}