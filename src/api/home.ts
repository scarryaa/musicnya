export const fetchRecommendations = async ({
  devToken,
  musicUserToken,
}: {
  devToken: string;
  musicUserToken: string;
}) => {
  const response = await fetch(
    "https://amp-api.music.apple.com/v1/me/recommendations?art[url]=f&displayFilter[kind]=MusicCircleCoverShelf,MusicCoverGrid,MusicCoverShelf,MusicNotesHeroShelf,MusicSocialCardShelf,MusicSuperHeroShelf&extend=editorialVideo,plainEditorialCard,plainEditorialNotes&extend[playlists]=artistNames&extend[stations]=airTime,supportsAirTimeUpdates&fields[artists]=name,artwork,url&format[resources]=map&include[albums]=artists&include[personal-recommendation]=primary-content&include[stations]=radio-show&l=en-US&meta[stations]=inflectionPoints&name=listen-now&omit[resource]=autos&platform=web&timezone=-04:00&types=activities,albums,apple-curators,artists,curators,editorial-items,library-albums,library-playlists,music-movies,music-videos,playlists,social-profiles,social-upsells,songs,stations,tv-episodes,tv-shows,uploaded-audios,uploaded-videos&with=friendsMix,library,social",
    {
      headers: {
        authorization: `Bearer ${devToken}`,
        "music-user-token": musicUserToken,
      },
    },
  );
  const recommendations = await response.json();
  return recommendations;
};
