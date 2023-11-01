const { BrowserWindow: ElectronBrowserWindow } = require("electron");
const path = require("path");

class BrowserWindow {
  static win = null;

  createWindow() {
    BrowserWindow.win = new ElectronBrowserWindow({
      width: 1100,
      height: 700,
      minWidth: 1100,
      minHeight: 700,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.cjs")
      },
      autoHideMenuBar: true,
      frame: false
    });

    return BrowserWindow.win;
  }
}

module.exports = { BrowserWindow };
