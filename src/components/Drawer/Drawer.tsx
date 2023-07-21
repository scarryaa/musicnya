import { BiSolidHome, BiSolidPlaylist, BiSolidAlbum } from "solid-icons/bi";
import { IoGrid, IoRadio, IoSettings, IoAlbums } from "solid-icons/io";
import { BsMusicNote, BsPeopleFill } from "solid-icons/bs";
import { CircleIcon } from "../CircleIcon/CircleIcon";
import styles from "./Drawer.module.scss";
import { A } from "@solidjs/router";

const lightTheme = false;
//matchMedia("(prefers-color-scheme: light)").matches;

export function Drawer() {
  return (
    <div class={styles.drawer}>
      <div class={styles.drawer__top}>
        <CircleIcon style="margin-top: 10px;" />
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
        <A title="settings" href="/settings" activeClass="active-route">
          <IoSettings size={25} fill={lightTheme ? "#aaa" : "#757575"} />
        </A>
      </div>
    </div>
  );
}
