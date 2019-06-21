
const {app, BrowserWindow, Menu} = require('electron');
const fs = require("file-system");
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
app.mainWindow = null;
app.loader = null;

function toggleBeta() {
  if(app.config) {
    try {
      fs.unlinkSync(app.getPath('userData') + '/data.json')
    } catch (err) {}
    app.config = null;
  } else {
    fs.writeFileSync(app.getPath('userData') + '/data.json', `{"beta": true}`);
    app.config = {"beta": true};
  }
  app.quit();
}

function addListener(err, files, on) {
  files.forEach(f => {
    console.log(f)
    const fileName = f.split('.')[0]
    if(f.split('.')[1] != 'js') return;
    if(on == 'app') var props = require('./events/app/' + f)
    if(on == 'autoUpdater') props = require('./events/autoUpdater/' + f);
    console.log(props)
    if(!props) return;
    if(on == 'app') {
      return app.on(fileName, props.func);
    }
    if(on == 'autoUpdater') {
      return autoUpdater.on(fileName, props.func);
    }
  });
}
function sendStatusToWindow(text, err) {
  if(app.loader == null) return;
  if(text) console.log(text);
  if(err) console.error('Error: ' + err)
  app.loader.webContents.send('message', text, err);
}

fs.readdir(__dirname + '/events/app', {}, function(err, files) {
  addListener(err, files, 'app');
});
if(!app.config) {
  fs.readdir(__dirname + '/events/autoUpdater', {}, function(err, files) {
    addListener(err, files, 'autoUpdater');
  });
}

autoUpdater.channel = 'latest';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function createWindow () {
  sendStatusToWindow('Starting...');
    app.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      frame: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        preload: __dirname + '/preload.js'
      },
      show: false 
    })
  app.mainWindow.on('ready-to-show', () => {
    if(app.loader != null) app.loader.destroy();
    app.loader = null;
    app.mainWindow.show();
    //loader.destroy();
  })
  app.mainWindow.loadURL('https://github.com');

  app.mainWindow.on('closed', function () {
    app.mainWindow = null
  })
}

process.on('uncaughtException', function (err) {
  console.error(err);
  return;
})

module.exports = {autoUpdater, app, sendStatusToWindow, createWindow, BrowserWindow, Menu, toggleBeta, createWindow};