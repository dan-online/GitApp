const { app, BrowserWindow, Menu, ipcMain, shell, Tray } = require("electron");
const fs = require("file-system");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

app.notifs = [];
app.mainWindow = null;
app.loader = null;
app.window = {};

function toggleBeta() {
  if (app.config) {
    try {
      fs.unlinkSync(app.getPath("userData") + "/data.json");
    } catch (err) {}
    app.config = null;
  } else {
    fs.writeFileSync(app.getPath("userData") + "/data.json", `{"beta": true}`);
    app.config = { beta: true };
  }
  app.quit();
}

function addListener(err, files, on) {
  files.forEach(f => {
    const fileName = f.split(".")[0];
    if (f.split(".")[1] != "js") return;
    if (on == "app") var props = require("./events/app/" + f);
    if (on == "autoUpdater") props = require("./events/autoUpdater/" + f);
    if (!props) return;
    if (on == "app") {
      return app.on(fileName, props.func);
    }
    if (on == "autoUpdater") {
      return autoUpdater.on(fileName, props.func);
    }
  });
}
function sendStatusToWindow(text, err) {
  if (app.loader == null) return;
  if (text) console.log(text);
  if (err) console.error("Error: " + err);
  app.loader.webContents.send("message", text, err);
}

fs.readdir(__dirname + "/events/app", {}, function(err, files) {
  addListener(err, files, "app");
});
if (!app.config) {
  fs.readdir(__dirname + "/events/autoUpdater", {}, function(err, files) {
    addListener(err, files, "autoUpdater");
  });
}

autoUpdater.channel = "latest";
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

function createBgWindow(cb) {
  app.bgWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: __dirname + "/notifications.js"
    }
  });
  app.bgWindow.loadURL("https://github.com/notifications");
  app.bgWindow.on("ready-to-show", () => {
    cb(true);
  });
}

function createWindow() {
  createBgWindow(function() {
    if (app.mainWindow != null) return;
    sendStatusToWindow("Starting...");
    app.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      titleBarStyle: "hidden",
      webPreferences: {
        preload: __dirname + "/preload.js"
      },
      show: false
    });
    app.mainWindow.on("ready-to-show", () => {
      if (app.loader != null) app.loader.destroy();
      app.loader = null;
      app.mainWindow.show();
      try {
        require(app.getPath("userData") + "/started.json");
      } catch (err) {
        app.startWindow = new BrowserWindow({
          resizable: false,
          show: false,
          width: 800,
          height: 550,
          frame: false,
          titleBarStyle: "hidden"
        });
        fs.writeFileSync(
          app.getPath("userData") + "/started.json",
          `{"started": true}`
        );
        app.startWindow.loadURL(
          "file:///" + __dirname + "/web/start/index.html"
        );
        //app.startWindow.webContents.openDevTools();
        app.startWindow.webContents.on("dom-ready", () => {
          app.startWindow.show();
        });
      }
      //app.mainWindow.webContents.openDevTools();
      //loader.destroy();
    });
    if (app.window && app.window.location && app.window.location.href)
      app.mainWindow.loadURL(app.window.location.href);
    else app.mainWindow.loadURL("https://github.com");

    app.mainWindow.on("closed", function() {
      app.mainWindow = null;
    });

    app.mainWindow.webContents.on("will-navigate", function(event, url) {
      event.preventDefault();
      if (!url.includes("github.")) return shell.openExternal(url);
      return app.mainWindow.loadURL(url);
    });
  });
}

function getWindowPosition() {
  const windowBounds = app.trayWindow.getBounds();
  const trayBounds = app.tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
}

function trayWindow() {
  if (!app.trayWindow) {
    app.trayWindow = new BrowserWindow({
      width: 300,
      height: 450,
      frame: false,
      resizable: false,
      show: false
    });
    app.trayWindow.loadURL(`file:///${__dirname + "/web/tray/index.html"}`);
    app.trayWindow.on("blur", () => {
      if (!app.trayWindow.webContents.isDevToolsOpened()) {
        app.trayWindow.hide();
      }
    });
    return trayWindow();
  }
  app.trayWindow.loadURL(`file:///${__dirname + "/web/tray/index.html"}`);
  const position = getWindowPosition();
  app.trayWindow.setPosition(position.x, position.y, false);
  app.trayWindow.show();
  app.trayWindow.focus();
}

ipcMain.on("url_send", (err, data) => {
  app.window.location = data.location;
});

ipcMain.on("clicked_notif", (err, url) => {
  app.mainWindow.loadURL(url);
});

ipcMain.on("viewed_notif", function(err, element) {
  app.notifs.push(element);
});

ipcMain.on("fetch_notifs", () => {
  app.bgWindow.webContents.send("notifs", app.notifs);
});

process.on("uncaughtException", function(err) {
  console.error(err);
  return;
});

module.exports = {
  autoUpdater,
  app,
  sendStatusToWindow,
  createWindow,
  BrowserWindow,
  Menu,
  toggleBeta,
  createWindow,
  Tray,
  trayWindow
};
