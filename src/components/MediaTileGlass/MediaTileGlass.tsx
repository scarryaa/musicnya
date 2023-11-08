import { For, Show, createSignal } from "solid-js";
import {
  IoPlay,
  IoEllipsisVertical,
  IoAddCircleOutline,
  IoHeart,
  IoHeartOutline,
  IoShare,
  IoThumbsDown,
  IoThumbsDownOutline,
  IoTrashOutline
} from "solid-icons/io";
import styles from "./MediaTileGlass.module.scss";
import { A } from "@solidjs/router";
import { constructLink } from "../../util/utils";
import {
  checkIsLoved,
  dislike,
  love,
  undoDislike,
  unlove
} from "../../api/love";
import { setContextMenu } from "../../stores/store";
import { BiSolidPlaylist } from "solid-icons/bi";
import { CgRowFirst, CgRowLast } from "solid-icons/cg";
import { getUrl } from "../../api/get-url";
import { removeFromLibrary, addToLibrary } from "../../api/library-actions";

export interface MediaTileProps {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
  artistIds: string[];
}

export function MediaTileGlass(props: MediaTileProps) {
  const [isLoved, setIsLoved] = createSignal(false);
  const [isDisliked, setIsDisliked] = createSignal(false);

  const constructShareLink = async (type: string, id: string): Promise<any> => {
    return await getUrl(type, id).then((res) => {
      return res.json();
    });
  };

  const handleContextMenu = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();

    // check if item is loved
    await checkIsLoved(props.type, props.id).then(async (res) => {
      const isLoved = await res
        .json()
        .then((res) => res.data[0]?.attributes?.value === 1);
      setIsLoved(() => isLoved);
      mediaTileContextMenu[1].icon = isLoved ? IoHeart : IoHeartOutline;
    });

    // check if item is disliked
    await checkIsLoved(props.type, props.id).then(async (res) => {
      const isDisliked = await res
        .json()
        .then((res) => res.data[0]?.attributes?.value === -1);
      setIsDisliked(() => isDisliked);
      mediaTileContextMenu[2].icon = isDisliked
        ? IoThumbsDown
        : IoThumbsDownOutline;
    });

    setContextMenu({
      value: {
        open: true,
        x: e.clientX,
        y: e.clientY,
        items: mediaTileContextMenu,
        id: props.id,
        type: props.type,
        display: "block"
      }
    });
  };

  const mediaTileContextMenu = [
    props.type === "stations"
      ? null
      : props.type === "library-playlists"
      ? {
          icon: IoTrashOutline,
          action: async () => {
            await removeFromLibrary(
              props.type.replace("library-", ""),
              props.id
            );
          },
          isQuickAction: true
        }
      : {
          icon: IoAddCircleOutline,
          action: async () => {
            await addToLibrary(props.type.replace("library-", ""), props.id);
          },
          isQuickAction: true
        },
    {
      icon: IoHeartOutline,
      action: async () => {
        isLoved()
          ? await unlove(props.type, props.id)
          : await love(props.type, props.id);
      },
      isQuickAction: true
    },
    {
      icon: IoThumbsDownOutline,
      action: async () => {
        isDisliked()
          ? await undoDislike(props.type, props.id)
          : await dislike(props.type, props.id);
      },
      isQuickAction: true
    },
    props.type === "stations"
      ? null
      : {
          icon: CgRowFirst,
          action: async () => {
            console.log("first");
          },
          isQuickAction: true,
          iconSize: 26
        },
    props.type === "stations"
      ? null
      : {
          icon: CgRowLast,
          action: () => {
            console.log("last");
          },
          isQuickAction: true,
          iconSize: 26
        },
    props.type === "stations"
      ? null
      : {
          label: "Add to Playlist",
          icon: BiSolidPlaylist,
          action: () => {}
        },
    {
      label: "Share",
      icon: IoShare,
      action: async () => {
        await constructShareLink(props.type, props.id)
          .then((res) => res.data[0].attributes.url || "")
          .then((res) => {
            return res;
          })
          .then(async (res) => {
            await navigator.clipboard.writeText(res);
          });
      }
    }
  ];

  return (
    <div
      class={styles.mediaTileGlass}
      onContextMenu={(e) => {
        void handleContextMenu(e);
      }}
    >
      <div class={styles.mediaTileGlass__overlay}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.mediaTileGlass__overlay__inner}
        >
          <IoPlay
            size={40}
            class={styles.mediaTileGlass__overlay__inner__button}
            onclick={async (e) => {
              e.preventDefault();
              await MusicKit.getInstance().setQueue({
                [props.type.substring(0, props.type.length - 1)]: props.id,
                startPlaying: true
              });
            }}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTileGlass__overlay__inner__button__more}
            onclick={(e) => {
              e.preventDefault();
              console.log("more");
            }}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.mediaTileGlass__image}
          src={props.mediaArt.url}
          alt="Album Art"
        />
      </div>
      <div
        class={styles.mediaTileGlass__backdrop}
        style={{
          background: `url(${props.mediaArt.url})`,
          "background-position": "center"
        }}
      ></div>
      <div class={styles.mediaTileGlass__mediaInfo}>
        <A href={constructLink(props.type, props.id)}>
          <div class={styles.mediaTileGlass__mediaInfo__title}>
            {props.title}
          </div>
        </A>
        <div class={styles.mediaTileGlass__mediaInfo__artist}>
          <Show when={props?.artists?.length >= 1}>
            <For each={props.artists}>
              {(artist, i) => (
                <A
                  href={constructLink("artists", props.artistIds?.[i()])}
                  class={styles.mediaTileGlass__mediaInfo__artist__name}
                >
                  {artist}
                  {i() !== props.artists.length - 1 && ", "}
                </A>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
}
