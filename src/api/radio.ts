interface Response {
  data: [
    {
      id: string
      type: string
      href: string
    },
  ]
  errors: [
    {
      id: string
      status: string
      code: string
      title: string
      detail: string
    },
  ]
}

export const fetchRadio = async ({
  devToken,
  musicUserToken
}: {
  devToken: string
  musicUserToken: string
}) => {
  return await fetch(
    'https://amp-api.music.apple.com/v1/editorial/us/groupings?art[url]=c,f&extend=artistUrl,editorialArtwork,plainEditorialNotes&extend[station-events]=editorialVideo&fields[albums]=artistName,artistUrl,artwork,contentRating,editorialArtwork,plainEditorialNotes,name,playParams,releaseDate,url,trackCount&fields[artists]=name,url,artwork&include[albums]=artists&include[music-videos]=artists&include[songs]=artists&include[stations]=events,radio-show&l=en-US&name=radio&omit[resource:artists]=relationships&platform=web&relate[songs]=albums&tabs=subscriber',
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
