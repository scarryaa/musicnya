export const removeFromLibrary = async (type: string, id: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/library/${type}/${id}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      }
    }
  );
  return response;
};

export const addToLibrary = async (type: string, id: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/library?ids[${type}]=${id}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      }
    }
  );
  return response;
};

export const createPlaylist = async (name: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/library/playlists`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      },
      body: JSON.stringify({
        attributes: {
          name
        }
      })
    }
  );
  return response;
};
