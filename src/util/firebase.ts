/*
Module containg the firebase configuration as well as the
functions used to interact with the database.
*/

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc
} from "firebase/firestore/lite";
import { fetchLibrarySongs } from "../api/library-songs";
import { fetchLibraryPlaylists } from "../api/library-playlists";
import { fetchLibraryAlbums } from "../api/library-albums";
import { fetchLibraryArtists } from "../api/library-artists";
import { userToken, cutToken, firebaseApp, db } from "../App";

const artworkPlaceholder =
  "https://raw.githubusercontent.com/scarryaa/musicnya/main/src/assets/music_note.png";
const namePlaceholder = "Unknown";

/**
 *  Add a user to the database if they don't already exist
 */
export const addUser = async () => {
  const libRef = collection(getFirestore(firebaseApp), "users");
  const libSnapshot = await getDocs(libRef);

  libSnapshot.docs.map((doc) => doc.data());
  const userDoc = doc(libRef, cutToken);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Document data:", data);
  } else {
    await setDoc(doc(libRef, cutToken), {
      songs: (
        await fetchLibrarySongs({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((song) => ({
        title: song.attributes.name || namePlaceholder,
        artist: song.attributes.artistName || namePlaceholder,
        album: song.attributes.albumName || namePlaceholder,
        duration: new Date(song.attributes.durationInMillis)
          .toISOString()
          .substr(15, 4)
      })),
      playlists: (
        await fetchLibraryPlaylists({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((playlist) => ({
        mediaArt: playlist.attributes.artwork || artworkPlaceholder,
        title: playlist.attributes.name || namePlaceholder,
        type: playlist.type,
        id: playlist.id
      })),
      albums: (
        await fetchLibraryAlbums({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((album) => ({
        mediaArt: album.attributes.artwork || artworkPlaceholder,
        title: album.attributes.name || namePlaceholder,
        artists: album.attributes.artistName || namePlaceholder,
        type: album.type,
        id: album.id,
        artistIds: album.relationships.artists.data.map((artist) => artist.id)
      })),
      artists: (
        await fetchLibraryArtists({
          devToken: MusicKit.getInstance().developerToken,
          musicUserToken: userToken
        })
      ).data.map((artist) => ({
        mediaArt:
          artist.relationships.catalog.data[0]?.attributes.artwork ||
          artworkPlaceholder,
        title: artist.attributes.name || namePlaceholder,
        type: artist.type,
        id: artist.id,
        artistIds: artist.relationships.catalog.data.map((artist) => artist.id)
      }))
    });
  }
};

/**
 * Get the user's library from the database
 * @returns the user's library
 */

export const getLibrary = async () => {
  const libRef = collection(getFirestore(firebaseApp), "users");
  const libSnapshot = await getDocs(libRef);

  libSnapshot.docs.map((doc) => doc.data());
  const userDoc = doc(libRef, cutToken);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data;
  } else {
    console.log("No such document!");
  }
};
