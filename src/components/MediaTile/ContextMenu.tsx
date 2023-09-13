import {
  IoAddCircleOutline,
  IoHeartOutline,
  IoPlayCircleOutline,
  IoShare,
  IoThumbsDownOutline
} from "solid-icons/io";
import { CgRowFirst, CgRowLast } from "solid-icons/cg";
import type { ContextMenuType } from "../../types/context-menu";
import { BiSolidPlaylist } from "solid-icons/bi";

export const mediaTileContextMenu = [
  {
    icon: IoAddCircleOutline,
    action: () => {
      console.log("Add to Library");
    },
    isQuickAction: true
  },
  {
    icon: IoHeartOutline,
    action: () => {
      console.log("Love");
    },
    isQuickAction: true
  },
  {
    icon: IoThumbsDownOutline,
    action: () => {
      console.log("Dislike");
    },
    isQuickAction: true
  },
  {
    icon: CgRowFirst,
    action: () => {
      console.log("Play Next");
    },
    isQuickAction: true,
    iconSize: 26
  },
  {
    icon: CgRowLast,
    action: () => {
      console.log("Play Last");
    },
    isQuickAction: true,
    iconSize: 26
  },
  {
    label: "Add to Playlist",
    icon: BiSolidPlaylist,
    action: () => {}
  },
  {
    label: "Share",
    icon: IoShare,
    action: () => {}
  }
  // {
  //   label: "Properties",
  //   icon: IoAddCircleOutline,
  //   action: () => {}
  // }
];
