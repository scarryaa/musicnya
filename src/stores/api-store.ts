import { createResource } from "solid-js";
import { fetchAlbum } from "../api/album";
import { fetchLibraryAlbum } from "../api/library-album";
import { fetchArtist } from "../api/artist";
import { fetchBrowse } from "../api/browse";
import { fetchCurator } from "../api/curator";
import { fetchRecommendations } from "../api/home";
import { fetchMultiplex } from "../api/multiplex";
import { fetchMultiroom } from "../api/multiroom";
import { fetchPlaylist } from "../api/playlist";
import { fetchLibraryPlaylist } from "../api/library-playlist";
import { fetchRadio } from "../api/radio";
import { fetchStation } from "../api/station";
import { fetchSearchCategories, fetchSearchResults } from "../api/search";
import { fetchLibraryAlbums } from "../api/library-albums";
import { fetchLibraryPlaylists } from "../api/library-playlists";
import { fetchLibraryArtists } from "../api/library-artists";
import { fetchLibrarySongs } from "../api/library-songs";
import * as config from "../../config.json";

export const createAlbumStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource(
      () => params.id,
      async () =>
        await (params.id.startsWith("l.") ? fetchLibraryAlbum : fetchAlbum)({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          id: params.id
        })
    );

    return data;
  };
};

export const createLibraryAlbumsStore = () => {
  return function () {
    const [data] = createResource(
      () => {
        return {
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        };
      },
      async () => {
        return await fetchLibraryAlbums({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        });
      }
    );

    return data;
  };
};

export const createSearchCategoriesStore = () => {
  return function () {
    const [data] = createResource<
      any,
      {
        devToken: string;
        musicUserToken: string;
      },
      string
    >(
      {
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken
      },
      fetchSearchCategories
    );

    return data;
  };
};

export const createSearchResultsStore = () => {
  return function (params: { term: string }) {
    const [data] = createResource(
      () => params.term,
      async () => {
        return await fetchSearchResults({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          term: params.term
        });
      }
    );

    return data;
  };
};

export const createArtistStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource(
      () => params.id,
      async () => {
        return await fetchArtist({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          id: params.id
        });
      }
    );

    return data;
  };
};

export const createBrowseStore = () => {
  return function () {
    const [data] = createResource<
      any,
      {
        devToken: string;
        musicUserToken: string;
      },
      string
    >(
      {
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken
      },
      fetchBrowse
    );

    return data;
  };
};

export const createCuratorStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource(
      () => params.id,
      async () => {
        return await fetchCurator({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          id: params.id
        });
      }
    );

    return data;
  };
};

export const createHomeStore = () => {
  return function () {
    const [data] = createResource<
      any,
      {
        devToken: string;
        musicUserToken: string;
      },
      string
    >(
      {
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken
      },
      fetchRecommendations
    );

    return data;
  };
};

export const createMultiplexStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource(
      () => params.id,
      async () => {
        return await fetchMultiplex({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          id: params.id
        });
      }
    );

    return data;
  };
};

export const createMultiroomStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource(
      () => params.id,
      async () => {
        return await fetchMultiroom({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken,
          id: params.id
        });
      }
    );

    return data;
  };
};

export const createPlaylistStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource<
      any,
      {
        devToken: string;
        musicUserToken: string;
        id: string;
      },
      string
    >(
      {
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken,
        id: params.id
      },
      params.id.substring(0, 2) === "pl" ? fetchPlaylist : fetchLibraryPlaylist
    );

    return data;
  };
};

export const createLibraryPlaylistStore = () => {
  return function () {
    const [data] = createResource(
      () => {
        return {
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        };
      },
      async () => {
        return await fetchLibraryPlaylists({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        });
      }
    );

    return data;
  };
};

export const createLibraryArtistsStore = () => {
  return function () {
    const [data] = createResource(
      () => {
        return {
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        };
      },
      async () => {
        return await fetchLibraryArtists({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        });
      }
    );

    return data;
  };
};

export const createLibrarySongsStore = () => {
  return function () {
    const [data] = createResource(
      () => {
        return {
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        };
      },
      async () => {
        return await fetchLibrarySongs({
          devToken: config.MusicKit.token,
          musicUserToken: MusicKit.getInstance()?.musicUserToken
        });
      }
    );

    return data;
  };
};

export const createRadioStore = () => {
  return function () {
    const [data] = createResource<
      any,
      {
        devToken: string;
        musicUserToken: string;
      },
      string
    >(
      {
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken
      },
      fetchRadio
    );

    return data;
  };
};

export const createStationStore = () => {
  return function (params: { id: string }) {
    const [data] = createResource<
      any,
      {
        devToken: string;
        musicUserToken: string;
        id: string;
      },
      string
    >(
      {
        devToken: config.MusicKit.token,
        musicUserToken: MusicKit.getInstance()?.musicUserToken,
        id: params.id
      },
      fetchStation
    );

    return data;
  };
};
