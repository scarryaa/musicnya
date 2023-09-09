export const fetchSearchCategories = async ({
  devToken,
  musicUserToken
}: {
  devToken: string
  musicUserToken: string
}) => {
  return await fetch(
    'https://amp-api.music.apple.com/v1/recommendations/us?art[url]=c,f&extend=editorialArtwork&l=en-US&name=search-landing&omit[resource]=autos&platform=web&types=activities,apple-curators,editorial-items',
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

export const fetchSearchResults = async ({
  devToken,
  musicUserToken,
  term
}: {
  devToken: string
  musicUserToken: string
  term: string
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/us/search/suggestions?art[url]=f&fields[albums]=artwork,name,playParams,url,artistName&fields[artists]=url,name,artwork&kinds=terms,topResults&l=en-US&limit[results:terms]=5&limit[results:topResults]=10&omit[resource]=autos&platform=web&term=${term}&types=activities,albums,artists,editorial-items,music-movies,music-videos,playlists,record-labels,songs,stations,tv-episodes`,
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
