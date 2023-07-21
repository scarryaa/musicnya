const { app, BrowserWindow, components } = require("electron");

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
