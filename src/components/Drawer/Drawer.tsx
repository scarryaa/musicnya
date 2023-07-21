import { BiSolidHome } from "solid-icons/bi";
import { IoGrid, IoRadio, IoSettings } from "solid-icons/io";
import { CircleIcon } from "../CircleIcon/CircleIcon";
import styles from "./Drawer.module.scss";
import { A } from "@solidjs/router";

export function Drawer() {
  return (
    <div class={styles.drawer}>
      <div class={styles.top}>
        <CircleIcon style="margin-top: 10px;" />
      </div>
      <div class={styles.middle}>
        <A href="/home">
          <BiSolidHome size={25} fill="#d6d6d6" />
        </A>
        <A href="/browse">
          <IoGrid size={25} fill="#d6d6d6" />
        </A>
        <A href="/radio">
          <IoRadio size={25} fill="#d6d6d6" />
        </A>
      </div>
      <div class={styles.bottom}>
        <A href="/settings">
          <IoSettings size={25} fill="#d6d6d6" />
        </A>
      </div>
    </div>
  );
}
