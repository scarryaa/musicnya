export const fetchStation = async ({
  devToken,
  musicUserToken,
  id,
}: {
  devToken: string;
  musicUserToken: string;
  id: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/us/stations/${id}?art[url]=f&extend=editorialArtwork&l=en-US&platform=web`,
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
