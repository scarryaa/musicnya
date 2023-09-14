export const love = async (type: string, id: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/ratings/${type}/${id}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      },
      body: JSON.stringify({
        attributes: {
          value: 1
        }
      })
    }
  );
  return response;
};

export const undoDislike = async (type: string, id: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/ratings/${type}/${id}`,
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

export const dislike = async (type: string, id: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/ratings/${type}/${id}`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      },
      body: JSON.stringify({
        attributes: {
          value: -1
        }
      })
    }
  );
  return response;
};

export const unlove = async (type: string, id: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/ratings/${type}/${id}`,
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

export const checkIsLoved = async (type: string, songId: string) => {
  const response = await fetch(
    `https://amp-api.music.apple.com/v1/me/ratings/${type}?ids=${songId}`,
    {
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      }
    }
  );
  return response;
};
