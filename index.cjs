/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, components, ipcMain } = require("electron");
const path = require("path");
const { AutoClient } = require("discord-auto-rpc");

// Discord RPC
const client = new AutoClient({ transport: "ipc" });

client.on("ready", () => {
  console.log("Discord RPC connected");
});

client.endlessLogin({ clientId: "1126479353123971072" });

const APP_PROD_URL = "https://musicnya-1e14f.web.app";
const isDev = process.env.APP_DEV
  ? process.env.APP_DEV.trim() === "true"
  : false;
// Listen on a specific host via the HOST environment variable
const host = "0.0.0.0";
// Listen on a specific port via the PORT environment variable
const corsPort = 8080;

const corsProxy = require("cors-anywhere");
corsProxy
  .createServer({
    originWhitelist: [], // Allow all origins
    methodWhitelist: ["GET", "HEAD", "POST", "PUT", "DELETE"],
    setHeaders: {
      origin: "https://beta.music.apple.com",
      "access-control-allow-origin": [
        "https://music.apple.com",
        "https://localhost:4200",
        "https://localhost:3000",
        "https://localhost:3001"
      ],
      // set recieved headers
      "access-control-allow-headers":
        "Origin, X-Requested-With, Content-Type, Accept, Range",
      "access-control-allow-methods": "*",
      "access-control-allow-credentials": "true",
      "access-control-max-age": "86400"
    }
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createWindow = () => {
  const win = new BrowserWindow({
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

  ipcMain.on("minimize-window", () => {
    win.minimize();
  });
  ipcMain.on("maximize-window", () => {
    win.maximize();
  });
  ipcMain.on("close-window", () => {
    win.close();
  });

  // Discord RPC
  ipcMain.on("set-activity", (_, data) => {
    client.setActivity(data);
  });

  ipcMain.on("clear-activity", () => {
    client.clearActivity();
  });

  win.removeMenu();

  if (isDev) {
    void win.loadURL("http://localhost:3000");
    win.openDevTools();
  } else {
    void win.loadURL(APP_PROD_URL);
  }
};

void app.whenReady().then(async () => {
  await components.whenReady();
  createWindow();
});
