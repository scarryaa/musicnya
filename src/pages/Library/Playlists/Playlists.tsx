import { Switch, Match, For, createResource, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { MediaTile } from "../../../components/MediaTile/MediaTile";
import { replaceSrc } from "../../../util/utils";
import { Error } from "../../../components/Error/Error";
import styles from "./Playlists.module.scss";
import { getLibrary } from "../../../util/firebase";
import { NewPlaylistTile } from "../../../components/NewPlaylistTile/NewPlaylistTile";
import Modal from "../../../components/Modal/Modal";
import { createPlaylist } from "../../../api/library-actions";
import { fetchLibraryPlaylists } from "../../../api/library-playlists";
import * as config from "../../../../config.json";
import { playlists, setPlaylists } from "../../../stores/store";

export function Playlists(): JSX.Element {
  const [userLibrary] = createResource(async () => await getLibrary());
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [playlistName, setPlaylistName] = createSignal("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createNewPlaylist = () => {
    if (playlistName() === "") return;
    closeModal();
    createPlaylist(playlistName()).then(() => {
      fetchLibraryPlaylists({
        devToken: config.MusicKit.token,
        musicUserToken: config.MusicKit.musicUserToken
      }).then((res) => {
        console.log(res);
        setPlaylists({
          value: res.data
        });
      });
    });
  };

  return (
    <div class={styles.playlists}>
      <Switch fallback={<div>Not found</div>}>
        <Match
          when={
            userLibrary.state === "pending" ||
            userLibrary.state === "unresolved" ||
            userLibrary.state === "refreshing"
          }
        >
          <LoadingSpinner />
        </Match>
        <Match when={userLibrary.state === "errored"}>
          <Error error={userLibrary.error} />
        </Match>
        <Match when={userLibrary.state === "ready"}>
          <NewPlaylistTile onclick={openModal} />
          <For each={userLibrary()?.playlists}>
            {(playlist) => (
              <MediaTile
                id={playlist.id}
                type={playlist.type}
                title={playlist.title}
                artists={[]}
                artistIds={[]}
                mediaArt={
                  playlist.mediaArt && {
                    url: replaceSrc(playlist.mediaArt.url, 300)
                  }
                }
              />
            )}
          </For>
        </Match>
      </Switch>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h1 class={styles.modal__title}>Create new playlist</h1>
        <div class={styles.modal__content}>
          <input
            type="text"
            placeholder="Playlist name"
            class={styles.modal__content__input}
            value={playlistName()}
            autofocus
            onInput={(e) => setPlaylistName(e.currentTarget.value)}
          />
          <div class={styles.modal__content__buttons}>
            <button
              class={styles.modal__content__button}
              onClick={createNewPlaylist}
            >
              Create
            </button>
            <button class={styles.modal__content__button} onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
