import { FastAverageColor } from "fast-average-color";

export const replaceSrc = (src: string, size: number, format = "webp") => {
  if (src === undefined) return;
  return src
    .replace("{w}x{h}", `${size}x${size}`)
    .replace("{f}", format)
    .replace("{c}", "");
};

export const splitArtists = (artists: string) => {
  if (artists === undefined) return [];
  return artists.split("& ").map((artist) => artist.trim());
};

export const getArtworkColor = (src: string) => {
  const fac = new FastAverageColor();
  const color = fac.getColorAsync(src);
  return color.then((color) => color.hex);
};
