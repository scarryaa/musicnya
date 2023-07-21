const { app, BrowserWindow, components } = require("electron");
const { processImport } = require("process");

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
      origin: "https://music.apple.com",
      "access-control-allow-origin":
        "https://music.apple.com, https://localhost:4200, https://localhost:3000",
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

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    autoHideMenuBar: true,
    frame: false,
  });

  win.loadURL("http://localhost:3000");
};

app.whenReady().then(async () => {
  await components.whenReady();
  createWindow();
});
