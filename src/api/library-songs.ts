export const fetchLibrarySongs = async ({
  devToken,
  musicUserToken
}: {
  devToken: string;
  musicUserToken: string;
}) => {
  return await fetch(
    "https://amp-api.music.apple.com/v1/me/library/songs?offset=0&l=en-US&limit=100&include%5Blibrary-songs%5D=albums&sort=dateAdded",
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken
      }
    }
  )
    .then(async (response) => {
      const responseJson = await (response.json() as Promise<Response>);
      // make subsequent requests to get all songs, in groups of 100
      const total = responseJson.meta.total;
      const limit = 100;
      const requests = [];
      for (let i = 0; i < total / limit; i++) {
        requests.push(
          fetch(
            `https://amp-api.music.apple.com/v1/me/library/songs?offset=${
              i * limit
            }&l=en-US&limit=${limit}&include%5Blibrary-songs%5D=albums&sort=dateAdded`,
            {
              headers: {
                authorization: `Bearer ${devToken}`,
                "music-user-token": musicUserToken
              }
            }
          )
        );
      }
      const responses = await Promise.all(requests);
      const jsons = await Promise.all(
        responses.map((response) => response.json())
      );
      const songs = jsons
        .map((json) => json.data)
        .reduce((acc, val) => acc.concat(val), []);
      return {
        data: songs,
        meta: {
          total: songs.length
        }
      };
    })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
