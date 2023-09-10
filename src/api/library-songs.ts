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
      // make consequtive requests to get all songs
      if (responseJson.next) {
        const nextUrl = "https://amp-api.music.apple.com" + responseJson.next;
        const nextResponse = await fetch(nextUrl, {
          headers: {
            authorization: `Bearer ${devToken}`,
            "music-user-token": musicUserToken
          }
        });
        const nextResponseJson =
          await (nextResponse.json() as Promise<Response>);
        responseJson.data.push(...nextResponseJson.data);
      }
      return responseJson;
    })
    .catch((e) => {
      console.error(e);
      return e;
    });
};
