export const fetchArtist = async ({
  devToken,
  musicUserToken,
  id,
}: {
  devToken: string;
  musicUserToken: string;
  id: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/us/artists/${id}?art[url]=c,f&extend=artistBio,bornOrFormed,editorialArtwork,editorialVideo,extendedAssetUrls,hero,isGroup,origin,plainEditorialNotes&extend[playlists]=trackCount&include=record-labels,artists&include[music-videos]=artists&include[songs]=artists,albums&l=en-US&limit[artists:top-songs]=20&meta[albums:tracks]=popularity&platform=web&views=appears-on-albums,compilation-albums,featured-albums,featured-on-albums,featured-release,full-albums,latest-release,live-albums,more-to-hear,more-to-see,playlists,radio-shows,similar-artists,singles,top-music-videos,top-songs`,
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
