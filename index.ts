const { app, BrowserWindow, components, ipcMain } = require("electron");
const { processImport } = require("process");
const path = require("path");
const os = require("os");

// Listen on a specific host via the HOST environment variable
const host = "0.0.0.0";
// Listen on a specific port via the PORT environment variable
const corsPort = 8080;

const cors_proxy = require("cors-anywhere");
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    methodWhitelist: ["GET", "HEAD", "POST", "PUT", "DELETE"],
    setHeaders: {
      origin: "https://beta.music.apple.com",
      "access-control-allow-origin": [
        "https://music.apple.com",
        "https://localhost:4200",
        "https://localhost:3000",
        "https://localhost:3001",
      ],
      // set recieved headers
      "access-control-allow-headers":
        "Origin, X-Requested-With, Content-Type, Accept, Range",
      "access-control-allow-methods": "*",
      "access-control-allow-credentials": "true",
      "access-control-max-age": "86400",
    },
  })
  .listen(corsPort, host, function () {
    console.log("Running CORS Anywhere on " + host + ":" + corsPort);
  });

app.commandLine.appendSwitch("js-flags", "--max-old-space-size=250");
app.commandLine.appendSwitch("js-flags", "--expose_gc");
app.commandLine.appendSwitch("enable-accelerated-mjpeg-decode");
app.commandLine.appendSwitch("enable-accelerated-video");
app.commandLine.appendSwitch("disable-gpu-driver-bug-workarounds");
app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("enable-native-gpu-memory-buffers");
app.commandLine.appendSwitch("enable-accelerated-video-decode");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-native-gpu-memory-buffers");
app.commandLine.appendSwitch("enable-oop-rasterization");

if (process.platform === "linux") {
  app.commandLine.appendSwitch("disable-features", "MediaSessionService");
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
    autoHideMenuBar: true,
    frame: false,
  });

  ipcMain.on("minimize-window", () => {
    win.minimize();
  });
  ipcMain.on("maximize-window", () => {
    win.maximize();
  });
  ipcMain.on("close-window", () => {
    win.close();
  });

  win.removeMenu();

  win.loadURL("http://localhost:3000");
  win.openDevTools();
};

app.whenReady().then(async () => {
  await components.whenReady();
  createWindow();
});
