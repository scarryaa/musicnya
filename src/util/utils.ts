export const replaceSrc = (src: string, size: number, format = "webp") => {
  return src.replace("{w}x{h}", `${size}x${size}`).replace("{f}", format);
};

export const splitArtists = (artists: string) => {
  if (artists === undefined) return [];
  return artists.split("& ").map((artist) => artist.trim());
};
