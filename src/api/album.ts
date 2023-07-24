import { countryCode } from "../stores/store";

export const fetchAlbum = async ({
  devToken,
  musicUserToken,
  id,
}: {
  devToken: string;
  musicUserToken: string;
  id: string;
}) => {
  return await fetch(
    `https://amp-api.music.apple.com/v1/catalog/${countryCode.value}/albums/${id}?art[url]=f&extend=editorialArtwork,editorialVideo,extendedAssetUrls,offers&fields[artists]=name,url&fields[curators]=name&fields[record-labels]=name,url&include=record-labels,artists&include[music-videos]=artists&include[playlists]=curator&include[songs]=artists,composers,albums&l=en-US&meta[albums:tracks]=popularity&platform=web&views=appears-on,audio-extras,more-by-artist,other-versions,related-videos,video-extras,you-might-also-like`,
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
