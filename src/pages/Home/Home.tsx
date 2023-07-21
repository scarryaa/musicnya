import { createResource } from "solid-js";
import styles from "./Home.module.scss";
import { fetchRecommendations } from "../../api/home";

export function Home() {
  const [data] = createResource<any, string>(
    {
      devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
      musicUserToken: MusicKit.getInstance().musicUserToken,
    },
    fetchRecommendations,
  );

  return (
    <div class={styles.home}>
      <h1>home</h1>
    </div>
  );
}
