import { createResource } from "solid-js";
import { fetchAlbum } from "../api/album";
import { fetchLibraryAlbum } from "../api/library-album";

export function createAlbumStore() {
  return function (params: { id: string }) {
    const [data] = createResource(
      () => params.id,
      () =>
        (params.id.startsWith("l.") ? fetchLibraryAlbum : fetchAlbum)({
          devToken: import.meta.env.VITE_MUSICKIT_TOKEN,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          id: params.id,
        }),
    );

    return data;
  };
}
