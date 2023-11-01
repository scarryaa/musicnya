const { contextBridge, ipcRenderer } = require("electron");
console.info("Loaded Preload");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    let validChannels = [
      "close-window",
      "minimize-window",
      "maximize-window",
      "fromMain",
      "set-activity",
      "clear-activity",
      'play',
      'pause',
      'stop',
      'musickit-loaded',
      'mpris-update-data',
      'mpris-play',
      'mpris-pause',
      'mpris-stop',
      'mpris-next',
      'mpris-previous',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain", "mpris-play", "mpris-pause", "mpris-stop", "mpris-next", "mpris-previous"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});