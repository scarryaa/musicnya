import styles from "./LibraryAddBanner.module.scss";
import { LoadingSpinnerSmall } from "../LoadingSpinnerSmall/LoadingSpinnerSmall";

export const LibraryAddBanner = () => {
  return (
    <div class={styles.libraryAddBanner}>
      <p> Getting library...</p>
      <LoadingSpinnerSmall />
    </div>
  );
};
