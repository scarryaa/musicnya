export const fetchLibraryAlbum = async ({
  devToken,
  musicUserToken,
  id,
}: {
  devToken: string;
  musicUserToken: string;
  id: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/me/library/albums/${id}?art[url]=f&fields[artists]=name,url&format[resources]=map&includeOnly=catalog,artists,tracks&include[albums]=artists,tracks&include[library-albums]=artists,tracks&include[music-videos]=catalog,artists,tracks&l=en-US&platform=web`,
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
