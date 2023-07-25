import {
  BiSolidHome,
  BiSolidPlaylist,
  BiSolidAlbum,
  BiSolidMessage,
} from "solid-icons/bi";
import {
  IoGrid,
  IoRadio,
  IoSettings,
  IoAlbums,
  IoChevronBack,
  IoChevronForward,
} from "solid-icons/io";
import { BsList, BsMusicNote, BsPeopleFill } from "solid-icons/bs";
import { CircleIcon } from "../CircleIcon/CircleIcon";
import styles from "./Drawer.module.scss";
import { A } from "@solidjs/router";
import {
  rightPanelContent,
  rightPanelOpen,
  setRightPanelContent,
  setRightPanelOpen,
} from "../../stores/store";

const lightTheme = false;
//matchMedia("(prefers-color-scheme: light)").matches;

export function Drawer() {
  return (
    <div class={styles.drawer}>
      <div class={styles.drawer__top}>
        <CircleIcon style="margin-top: 10px;" />
        <div class={styles.drawer__top__nav_arrows}>
          <IoChevronBack
            size={25}
            fill={lightTheme ? "#aaa" : "#757575"}
            color={lightTheme ? "#aaa" : "#757575"}
            class={styles.drawer__top__nav_arrows__back}
            onclick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          />
          <IoChevronForward
            size={25}
            fill={lightTheme ? "#aaa" : "#757575"}
            color={lightTheme ? "#aaa" : "#757575"}
            class={styles.drawer__top__nav_arrows__forward}
            onclick={(e) => {
              e.preventDefault();
              window.history.forward();
            }}
          />
        </div>
      </div>
      <div class={styles.drawer__middle}>
        <A title="home" href="/home" activeClass="active-route">
          <BiSolidHome size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
        <A title="browse" href="/browse" activeClass="active-route">
          <IoGrid size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
        <A title="radio" href="/radio" activeClass="active-route">
          <IoRadio size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
        <A
          title="songs"
          href="/library/songs"
          style={"margin-top: 2rem;"}
          activeClass="active-route"
        >
          <BsMusicNote size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
        <A
          title="playlists"
          href="/library/playlists"
          activeClass="active-route"
        >
          <BiSolidPlaylist size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
        <A title="albums" href="/library/albums" activeClass="active-route">
          <BiSolidAlbum size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>{" "}
        <A title="artists" href="/library/artists" activeClass="active-route">
          <BsPeopleFill size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
      </div>
      <div class={styles.drawer__bottom}>
        <BiSolidMessage
          size={25}
          class={styles.drawer__bottom__lyrics}
          fill={lightTheme ? "#aaa" : "#757575"}
          onclick={(e) => {
            document.body.style.setProperty(
              "--panel-offset",
              rightPanelOpen.value
                ? rightPanelContent.value === "queue"
                  ? "18rem"
                  : "4rem"
                : "18rem",
            );

            rightPanelOpen.value === true &&
            rightPanelContent.value === "lyrics"
              ? setRightPanelOpen({ value: false })
              : setRightPanelOpen({ value: true });

            setRightPanelContent({ value: "lyrics" });
          }}
        />
        <BsList
          size={25}
          fill={lightTheme ? "#aaa" : "#757575"}
          onclick={() => {
            document.body.style.setProperty(
              "--panel-offset",
              rightPanelOpen.value
                ? rightPanelContent.value === "lyrics"
                  ? "18rem"
                  : "4rem"
                : "18rem",
            );

            rightPanelOpen.value === true && rightPanelContent.value === "queue"
              ? setRightPanelOpen({ value: false })
              : setRightPanelOpen({ value: true });

            setRightPanelContent({ value: "queue" });
          }}
        />
        <A title="settings" href="/settings" activeClass="active-route">
          <IoSettings size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
      </div>
    </div>
  );
}
