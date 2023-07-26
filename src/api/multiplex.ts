export const fetchMultiplex = async ({
  devToken,
  musicUserToken,
  id,
}: {
  devToken: string;
  musicUserToken: string;
  id: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/editorial/us/multiplex/${id}?art[url]=f&l=en-US&platform=web`,
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken,
      },
    },
  )
    .then((response) => {
      console.log(response);
      return response.json() as Promise<Response>;
    })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
