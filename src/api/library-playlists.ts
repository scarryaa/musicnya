export const fetchLibraryPlaylists = async ({
  devToken,
  musicUserToken
}: {
  devToken: string;
  musicUserToken: string;
}) => {
  return await fetch(
    "https://amp-api.music.apple.com/v1/me/library/playlists?art[url]=f&fields[playlists]=artistName,artistUrl,artwork,contentRating,editorialArtwork,name,playParams,releaseDate,url&fields[artists]=name,url&includeOnly=catalog,artists&include[playlists]=artists&include[library-playlists]=artists&l=en-US&limit=100&meta=sorts&offset=0&platform=web",
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken
      }
    }
  )
    .then(async (response) => {
      // Fetch list of songs for each playlist
      const playlists = await (response.json() as Promise<Response>);
      const playlistSongs = await Promise.all(
        playlists.data.map(async (playlist: any) => {
          const songs = await fetch(
            `https://amp-api.music.apple.com/v1/me/library/playlists/${playlist.id}/tracks?fields[tracks]=albumName,artistName,durationInMillis,name,playParams,trackNumber,url&include=catalog&l=en-US&limit=100&offset=0&platform=web`,
            {
              headers: {
                authorization: `Bearer ${devToken}`,
                "music-user-token": musicUserToken
              }
            }
          ).then(async (response) => {
            return await (response.json() as Promise<Response>);
          });
          return {
            ...playlist,
            songs: songs.data
          };
        })
      );

      console.log({ ...playlists, data: playlistSongs });

      return {
        ...playlists,
        data: playlistSongs
      };
    })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
