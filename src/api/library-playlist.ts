export const fetchLibraryPlaylist = async ({
  devToken,
  musicUserToken,
  id
}: {
  devToken: string;
  musicUserToken: string;
  id: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/me/library/playlists/${id}?art[url]=f&fields[songs]=artistUrl,artwork,durationInMillis,url&include=catalog,artists,tracks,fields&include[library-playlists]=catalog,tracks,fields,playlists&include[playlists]=curator&include[songs]=artists&l=en-US&omit[resource]=autos&platform=web`,
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken
      }
    }
  )
    .then(async (response) => {
      return await (response.json() as Promise<Response>);
    })
    .catch((e) => {
      console.error(e);
      return e;
    });
};

export const addToLibraryPlaylist = async ({ id, tracks, type }) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/me/library/playlists/${id}/tracks?l=en-US&platform=web`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "music-user-token": MusicKit.getInstance().musicUserToken
      },
      body: JSON.stringify({
        data: tracks
      })
    }
  )
    .then(async (response) => {
      return await (response.json() as Promise<Response>);
    })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
