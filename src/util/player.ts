// player.js
const Mpris = require("mpris-service");
const { BrowserWindow } = require("../../browserwindow.ts");

class Player {
  constructor() {
    this.player = Mpris({
      name: "musicnya",
      identity: "musicnya",
      supportedInterfaces: ["player"]
    });

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.updateMetadata = this.updateMetadata.bind(this);
    this.setIsPlaying = this.setIsPlaying.bind(this);
    this.setIsPaused = this.setIsPaused.bind(this);
    this.setIsStopped = this.setIsStopped.bind(this);

    // Listen to the MPRIS events for media buttons
    this.player.on("play", this.play);
    this.player.on("pause", this.pause);
    this.player.on("stop", this.stop);
    this.player.on("playpause", this.playPause.bind(this));
    this.player.on("next", this.next.bind(this));
    this.player.on("previous", this.previous.bind(this));
  }

  setIsPlaying() {
    this.player.playbackStatus = Mpris.PLAYBACK_STATUS_PLAYING;
  }

  setIsPaused() {
    this.player.playbackStatus = Mpris.PLAYBACK_STATUS_PAUSED;
  }

  setIsStopped() {
    this.player.playbackStatus = Mpris.PLAYBACK_STATUS_STOPPED;
  }

  play() {
    console.log("Play");
    BrowserWindow.win.webContents.send("mpris-play");
    this.player.playbackStatus = Mpris.PLAYBACK_STATUS_PLAYING;
  }

  pause() {
    console.log("Pause");
    BrowserWindow.win.webContents.send("mpris-pause");
    this.player.playbackStatus = Mpris.PLAYBACK_STATUS_PAUSED;
  }

  stop() {
    BrowserWindow.win.webContents.send("mpris-stop");
    this.player.playbackStatus = Mpris.PLAYBACK_STATUS_STOPPED;
  }

  playPause() {
    if (this.player.playbackStatus === Mpris.PLAYBACK_STATUS_PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateMetadata(attributes) {
    attributes = attributes.attributes;
    this.player.metadata = {
      "mpris:trackid": this.player.objectPath(
        `track/${attributes?.playParams?.id?.replace(/[^a-zA-Z 0-9]+/g, "")}`
      ),
      "mpris:length": attributes.durationInMillis * 1000,
      "mpris:artUrl": attributes.artwork.url
        .replace("/{w}x{h}bb", "/512x512bb")
        .replace("/2000x2000bb", "/35x35bb"),
      "xesam:title": `${attributes.name}`,
      "xesam:album": `${attributes.albumName}`,
      "xesam:artist": [`${attributes.artistName}`],
      "xesam:genre": attributes.genreNames
    };
  }

  next() {
    BrowserWindow.win.webContents.send("mpris-next");
  }

  previous() {
    BrowserWindow.win.webContents.send("mpris-previous");
  }
}

module.exports = Player;
