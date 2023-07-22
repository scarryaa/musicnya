type Response = {
  data: [
    {
      id: string;
      type: string;
      href: string;
    },
  ];
  errors: [
    {
      id: string;
      status: string;
      code: string;
      title: string;
      detail: string;
    },
  ];
};

export const fetchRecommendations = async ({
  devToken,
  musicUserToken,
}: {
  devToken: string;
  musicUserToken: string;
}) => {
  return await fetch(
    "https://amp-api.music.apple.com/v1/me/recommendations?art[url]=f&displayFilter[kind]=MusicCircleCoverShelf,MusicCoverGrid,MusicCoverShelf,MusicNotesHeroShelf,MusicSocialCardShelf,MusicSuperHeroShelf&extend=editorialVideo,plainEditorialCard,plainEditorialNotes&extend[playlists]=artistNames&extend[stations]=airTime,supportsAirTimeUpdates&fields[artists]=name,artwork,url&include[albums]=artists&include[personal-recommendation]=primary-content&include[stations]=radio-show&l=en-US&meta[stations]=inflectionPoints&name=listen-now&omit[resource]=autos&platform=web&timezone=-04:00&types=activities,albums,apple-curators,artists,curators,editorial-items,library-albums,library-playlists,music-movies,music-videos,playlists,social-profiles,social-upsells,songs,stations,tv-episodes,tv-shows,uploaded-audios,uploaded-videos&with=friendsMix,library,social",
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

  const recommendations = (await response.json()) as Response;

  if (recommendations.errors) {
    return new Error(recommendations.errors[0].detail);
  }

  console.log(recommendations);

  return recommendations.data.map((item) => {
    const map = recommendations.resources[item.type][item.id];
    const data = map.relationships?.contents?.data;
    const e = (map.relationships.contents.data = data.map((item) => {
      const map = recommendations.resources[item.type][item.id];
      console.log(map);
      return map;
    }));

    console.log(e);

    return e;
  });
};
