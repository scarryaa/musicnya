export const fetchLibraryArtists = async ({
    devToken,
    musicUserToken,
  }: {
    devToken: string;
    musicUserToken: string;
  }) => {
    return await fetch(
      `https://amp-api.music.apple.com/v1/me/library/artists/?include=catalog&platform=web&limit=100&l=en-us`,
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
  