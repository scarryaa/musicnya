import {
  IoAddCircleOutline,
  IoHeartOutline,
  IoPlayCircleOutline,
  IoThumbsDownOutline
} from "solid-icons/io";
import { CgRowFirst, CgRowLast } from "solid-icons/cg";
import type { ContextMenuType } from "../../types/context-menu";

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
    label: "Add to Queue",
    icon: IoAddCircleOutline,
    action: () => {}
  },
  {
    label: "Add to Playlist",
    icon: IoAddCircleOutline,
    action: () => {}
  },
  {
    label: "Share",
    icon: IoAddCircleOutline,
    action: () => {}
  }
];
