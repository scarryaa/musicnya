import { For, type JSX, Show, createSignal } from "solid-js";
import {
  IoPlay,
  IoEllipsisVertical,
  IoAddCircleOutline,
  IoHeartOutline,
  IoShare,
  IoThumbsDownOutline,
  IoHeart,
  IoThumbsDown,
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoTrashOutline
} from "solid-icons/io";
import styles from "./MediaTile.module.scss";
import { setQueue, stop } from "../../api/musickit";
import { A } from "@solidjs/router";
import musicNote from "../../assets/music_note.png";
import { BiSolidPlaylist } from "solid-icons/bi";
import { CgRowFirst, CgRowLast } from "solid-icons/cg";
import {
  playlists,
  setContextMenu,
  setSubContextMenu,
  subContextMenu
} from "../../stores/store";
import {
  checkIsLoved,
  dislike,
  love,
  undoDislike,
  unlove
} from "../../api/love";
import { getUrl } from "../../api/get-url";
import { constructLink } from "../../util/utils";
import { addToLibrary, removeFromLibrary } from "../../api/library-actions";
import {
  addToLibraryPlaylist,
  fetchLibraryPlaylist
} from "../../api/library-playlist";
import { fetchLibraryAlbum } from "../../api/library-album";
import { fetchAlbum } from "../../api/album";
import { fetchPlaylist } from "../../api/playlist";
import * as config from "../../../config.json";

export interface MediaTileProps {
  mediaArt: MusicKit.Artwork;
  title: string;
  artists: string[];
  type: MusicKit.MediaItemType;
  id: string;
  artistIds: string[];
}

export function MediaTile(props: MediaTileProps): JSX.Element {
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
        type: props.type
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
          action: () => {},
          hasSubContextMenu: true,
          onMouseOver: () => {
            setSubContextMenu({
              value: {
                open: true,
                x: 0,
                y: 40,
                items: playlists.value.map((playlist) => {
                  console.log(props.id);
                  return {
                    label: playlist.attributes.name,
                    icon: IoCheckmarkCircleOutline,
                    action: async () => {
                      props.type === "library-playlists"
                        ? await fetchLibraryPlaylist({
                            devToken: config.MusicKit.token,
                            musicUserToken: config.MusicKit.musicUserToken,
                            id: props.id
                          })
                            .then((res) => res.data[0])
                            .then(async (res) => {
                              const trackList =
                                res.relationships.tracks.data.map((track) => {
                                  return {
                                    id: track.id,
                                    type: track.type
                                  };
                                });

                              await addToLibraryPlaylist({
                                id: playlist.id,
                                tracks: trackList
                              });
                            })
                        : props.type === "library-albums"
                        ? await fetchLibraryAlbum({
                            devToken: config.MusicKit.token,
                            musicUserToken: config.MusicKit.musicUserToken,
                            id: props.id
                          })
                            .then((res) => res.data[0])
                            .then(async (res) => {
                              const trackList =
                                res.relationships.tracks.data.map((track) => {
                                  return {
                                    id: track.id,
                                    type: track.type
                                  };
                                });

                              await addToLibraryPlaylist({
                                id: playlist.id,
                                tracks: trackList
                              });
                            })
                        : props.type === "albums"
                        ? await fetchAlbum({
                            devToken: config.MusicKit.token,
                            musicUserToken: config.MusicKit.musicUserToken,
                            id: props.id
                          })
                            .then((res) => res.data[0])
                            .then(async (res) => {
                              const trackList =
                                res.relationships.tracks.data.map((track) => {
                                  return {
                                    id: track.id,
                                    type: track.type
                                  };
                                });

                              await addToLibraryPlaylist({
                                id: playlist.id,
                                tracks: trackList
                              });
                            })
                        : props.type === "playlists"
                        ? await fetchPlaylist({
                            devToken: config.MusicKit.token,
                            musicUserToken: config.MusicKit.musicUserToken,
                            id: props.id
                          })
                            .then((res) => res.data[0])
                            .then(async (res) => {
                              const trackList =
                                res.relationships.tracks.data.map((track) => {
                                  return {
                                    id: track.id,
                                    type: track.type
                                  };
                                });

                              await addToLibraryPlaylist({
                                id: playlist.id,
                                tracks: trackList
                              });
                            })
                        : null;
                    },
                    onMouseOver: () => {}
                  };
                })
              }
            });
          }
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
      },
      onMouseOver: () => {
        setSubContextMenu({
          value: {
            open: false,
            x: 0,
            y: 0
          }
        });
      }
    }
  ];

  return (
    <div
      class={styles.mediaTile}
      onContextMenu={(e) => {
        void handleContextMenu(e);
      }}
    >
      <div class={styles.mediaTile__overlay}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.mediaTile__overlay__inner}
        >
          <IoPlay
            size={40}
            class={styles.mediaTile__overlay__inner__button}
            onclick={(e) => {
              e.preventDefault();
              void stop();
              void setQueue(
                props.type
                  .substring(0, props.type.length - 1)
                  .replace("library-", ""),
                props.id,
                false
              ).then(() => {
                void MusicKit.getInstance().play();
              });
            }}
          />
          <IoEllipsisVertical
            size={26}
            class={styles.mediaTile__overlay__inner__button__more}
            onclick={(e) => {
              void handleContextMenu(e);
            }}
          />
        </A>
        <img
          loading="lazy"
          decoding="async"
          class={styles.mediaTile__image}
          src={props.mediaArt?.url || musicNote}
          alt="Album Art"
          width={150}
          height={150}
        />
      </div>
      <div class={styles.mediaTile__mediaInfo}>
        <A
          href={constructLink(props.type, props.id)}
          class={styles.mediaTile__mediaInfo__title}
        >
          {props.title}
        </A>
        <div class={styles.mediaTile__mediaInfo__artist}>
          <For each={props.artists}>
            {(artist, i) => (
              <A
                href={constructLink("artists", props.artistIds?.[i()])}
                class={styles.mediaTile__mediaInfo__artist__name}
              >
                {artist}
                <Show
                  when={
                    props.artists.length > 1 &&
                    artist !== props.artists[props.artists.length - 1]
                  }
                >
                  <span class={styles.mediaTile__mediaInfo__artist__separator}>
                    ,{" "}
                  </span>
                </Show>
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
