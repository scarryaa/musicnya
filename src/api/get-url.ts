export const getUrl = async (type: string, id: string) => {
  if (type === "library-playlists") {
    return await fetch(
      `https://amp-api.music.apple.com/v1/me/library/playlists/${id}/catalog?fields=url`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
          "music-user-token": MusicKit.getInstance().musicUserToken
        }
      }
    );
  } else {
    return await fetch(
      `https://amp-api.music.apple.com/v1/catalog/us/${type}/${id}?fields=url`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
          "music-user-token": MusicKit.getInstance().musicUserToken
        }
      }
    );
  }
};
