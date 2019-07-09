module.exports.on = "app";
const isOnline = require("is-online");
const {
  app,
  autoUpdater,
  BrowserWindow,
  Menu,
  sendStatusToWindow,
  toggleBeta
} = require("../../main");
module.exports.func = function() {
  try {
    app.config = require(app.getPath("userData") + "/data.json");
  } catch (err) {
    app.config = null;
  }
  if (!app.config) var beta = "Enable Beta";
  else var beta = "Disable Beta";
  const menuTemplate = [
    ...(process.platform === "darwin"
      ? [
          {
            label: app.getName(),
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
            ]
          }
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        process.platform === "darwin" ? { role: "close" } : { role: "quit" },
        {label: beta, click: function() {toggleBeta()}}
      ]
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(process.platform === "darwin"
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startspeaking" }, { role: "stopspeaking" }]
              }
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(process.platform === "darwin"
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" }
            ]
          : [{ role: "close" }])
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Website",
          click() {
            require("electron").shell.openExternalSync(
              "https://gitapp.dancodes.online"
            );
          }
        }
      ]
    }
  ];
  const menuBuilt = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menuBuilt);

  app.loader = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  app.loader.webContents.on("dom-ready", function() {
    app.loader.show();
    sendStatusToWindow("Loading GitApp...");
  });
  app.loader.loadURL(
    "file:///" + __dirname.split("/events")[0] + "/web/loader/index.html"
  );
  const checkOnline = async () => {
    let online = await isOnline();
    if (!online) {
      sendStatusToWindow(
        'No internet! Trying again in <span id="s">3</span> seconds'
      );
      return (wait = true);
    } else {
      if (app.config && app.config.beta) autoUpdater.allowPrerelease = true;
      autoUpdater.checkForUpdates();
      clearInterval(i);
    }
  };
  checkOnline();
  var i = setInterval(checkOnline, 4000);
};
