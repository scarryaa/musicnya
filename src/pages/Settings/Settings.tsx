import { createSignal } from "solid-js";
import styles from "./Settings.module.scss";

export function Settings() {
  const [darkMode, setDarkMode] = createSignal(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode());
    // theme = light
    if (darkMode()) {
      document.documentElement.setAttribute("theme", "dark");
    } else {
      document.documentElement.setAttribute("theme", "light");
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
          checked={darkMode()}
          onChange={toggleDarkMode}
        />
      </div>
    </div>
  );
}
