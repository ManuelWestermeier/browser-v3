const { app, BrowserWindow, globalShortcut } = require("electron");
const { join } = require("path");

process.env.DIST = join(__dirname, "../..");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST, "../public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

let mainWindow;
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "MW-Browser",
    icon: join(process.env.PUBLIC, "/icons/icon.png"),
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false, // Required for IPC
    },
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#080727",
      symbolColor: "#31c4f5",
      height: 30,
    },
  });
  mainWindow.maximize();
  mainWindow.focusOnWebView();
  // mainWindow.webContents.openDevTools();

  if (app.isPackaged) {
    mainWindow.loadFile(indexHtml);
  } else {
    mainWindow.loadURL(url);
  }

  // Register keyboard shortcuts when window is focused
  mainWindow.on("focus", () => {
    const keysToRegister = [
      //for / back
      "Alt+Left",
      "Alt+Right",
      //switch tab
      "CommandOrControl+Alt+Left",
      "CommandOrControl+Alt+Right",
      //navigation
      "Alt+R",
      "Alt+X",
      "Alt+W",
      "Alt+A",
      "Alt+T",
      "Alt+S",
    ];

    const registered = {};

    keysToRegister.forEach((key) => {
      globalShortcut.register(key, () => {
        if (registered[key]) return;
        mainWindow.webContents.send("key-pressed", key);
        registered[key] = true;
        setTimeout(() => {
          delete registered[key];
        }, 150);
      });
    });
  });

  // Unregister shortcuts when the window loses focus
  mainWindow.on("blur", () => {
    globalShortcut.unregisterAll();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
