import styles from "./Settings.module.scss";
import {
  darkMode,
  immersiveBackground,
  setDarkMode,
  setImmersiveBackground
} from "../../stores/store";

export function Settings() {
  const toggleDarkMode = () => {
    setDarkMode({ value: !darkMode.value });
    // theme = light
    if (darkMode.value) {
      document.documentElement.setAttribute("theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleImmersiveBackground = () => {
    setImmersiveBackground({ value: !immersiveBackground.value });
    if (immersiveBackground.value) {
      document.documentElement.setAttribute("immersion", "true");
      localStorage.setItem("immersion", "true");
    } else {
      document.documentElement.setAttribute("immersion", "false");
      localStorage.setItem("immersion", "false");
    }
  };

  return (
    <div class={styles.settings}>
      <div class={styles.settings__title}>
        <h1>settings</h1>
      </div>
      <div class={styles.settings__section}>
        <h2>dark mode</h2>
        <input
          type="checkbox"
          id="darkmode"
          name="darkmode"
          checked={darkMode.value}
          onChange={toggleDarkMode}
        />
      </div>
      <div class={styles.settings__section}>
        <h2>immersive background (experimental)</h2>
        <input
          type="checkbox"
          id="immersion"
          name="immersion"
          checked={immersiveBackground.value}
          onChange={toggleImmersiveBackground}
        />
      </div>
      <div class={styles.settings__section}>
        <button
          class={styles.settings__button}
          onClick={() => MusicKit.getInstance().unauthorize()}
        >
          logout
        </button>
      </div>
      <div class={styles.settings__section}>
        <button
          class={styles.settings__button}
          onClick={() => window.api.send("reload-app")}
        >
          reload app
        </button>
      </div>
    </div>
  );
}
