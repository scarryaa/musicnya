export const fetchCurator = async ({
  devToken,
  musicUserToken,
  id
}: {
  devToken: string
  musicUserToken: string
  id: string
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/us/apple-curators/${id}?art[url]=c,f&extend=editorialArtwork&extend[apple-curators]=plainEditorialNotes&extend[curators]=plainEditorialNotes&extend[stations]=plainEditorialNotes&fields[albums]=artistName,artistUrl,artwork,contentRating,editorialArtwork,plainEditorialNotes,name,playParams,releaseDate,url,trackCount&include=grouping,playlists&include[editorial-elements]=children,contents,room&include[songs]=artists&l=en-US&omit[resource]=autos&platform=web`,
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        'music-user-token': musicUserToken
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
