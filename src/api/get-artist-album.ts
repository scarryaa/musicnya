export const fetchLibraryAlbum = async ({
  devToken,
  musicUserToken,
  id
}: {
  devToken: string
  musicUserToken: string
  id: string
}) => {
  return await fetch(
      `https://amp-api.music.apple.com/v1/me/library/artists/${id}/albums?art[url]=f&fields[artists]=url&format[resources]=map&includeOnly=catalog,artists&include[library-albums]=artists,tracks&include[library-artists]=catalog&l=en-US&platform=web
      `,
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
