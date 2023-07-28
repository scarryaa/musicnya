import styles from "./Settings.module.scss";
import { darkMode, setDarkMode } from "../../stores/store";

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
    </div>
  );
}
