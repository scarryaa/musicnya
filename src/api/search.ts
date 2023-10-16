export const fetchSearchCategories = async ({
  devToken,
  musicUserToken
}: {
  devToken: string;
  musicUserToken: string;
}) => {
  return await fetch(
    "https://amp-api.music.apple.com/v1/recommendations/us?art[url]=c,f&extend=editorialArtwork&l=en-US&name=search-landing&omit[resource]=autos&platform=web&types=activities,apple-curators,editorial-items",
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken
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

export const fetchSearchSuggestions = async ({
  devToken,
  musicUserToken,
  term
}: {
  devToken: string;
  musicUserToken: string;
  term: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/us/search/suggestions?art[url]=f&fields[albums]=artwork,name,playParams,url,artistName&fields[artists]=url,name,artwork&kinds=terms,topResults&l=en-US&limit[results:terms]=5&limit[results:topResults]=10&omit[resource]=autos&platform=web&term=${term}&types=activities,albums,artists,editorial-items,music-movies,music-videos,playlists,record-labels,songs,stations,tv-episodes`,
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken
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
  devToken: string;
  musicUserToken: string;
  term: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/us/search?term=${term}&types=activities%2Calbums%2Capple-curators%2Cartists%2Ccurators%2Ceditorial-items%2Cmusic-movies%2Cmusic-videos%2Cplaylists%2Csongs%2Cstations%2Ctv-episodes%2Cuploaded-videos%2Crecord-labels&relate%5Beditorial-items%5D=contents&include%5Beditorial-items%5D=contents&include%5Balbums%5D=artists&include%5Bartists%5D=artists&include%5Bsongs%5D=artists%2Calbums&include%5Bmusic-videos%5D=artists&extend=artistUrl&fields%5Bartists%5D=url%2Cname%2Cartwork%2Chero&fields%5Balbums%5D=artistName%2CartistUrl%2Cartwork%2CcontentRating%2CeditorialArtwork%2CeditorialVideo%2Cname%2CplayParams%2CreleaseDate%2Curl&with=serverBubbles%2ClyricHighlights&art%5Burl%5D=c%2Cf&omit%5Bresource%5D=autos&platform=web&limit=25&l=en-us`,
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken
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
