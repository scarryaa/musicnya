export const fetchLibraryPlaylists = async ({
    devToken,
    musicUserToken,
  }: {
    devToken: string;
    musicUserToken: string;
  }) => {
    return await fetch(
      `https://amp-api.music.apple.com/v1/me/library/playlists?art[url]=f&fields[playlists]=artistName,artistUrl,artwork,contentRating,editorialArtwork,name,playParams,releaseDate,url&fields[artists]=name,url&includeOnly=catalog,artists&include[playlists]=artists&include[library-playlists]=artists&l=en-US&limit=100&meta=sorts&offset=0&platform=web`,
      {
        headers: {
          authorization: `Bearer ${devToken}`,
          "music-user-token": musicUserToken,
        },
      },
    )
      .then((response) => {
        return response.json() as Promise<Response>;
      })
      .catch((e) => {
        console.error(e);
        return e;
      });
  };
  