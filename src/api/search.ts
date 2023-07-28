export const fetchSearchCategories = async ({
  devToken,
  musicUserToken,
}: {
  devToken: string;
  musicUserToken: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/recommendations/us?art[url]=c,f&extend=editorialArtwork&l=en-US&name=search-landing&omit[resource]=autos&platform=web&types=activities,apple-curators,editorial-items`,
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
