
const {app, BrowserWindow} = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

autoUpdater.channel = 'latest';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Updating...');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Starting...');
  createWindow();
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in update!', err);
  setTimeout(() => {
    createWindow();
  },3000)
})



autoUpdater.on('download-progress', (progressObj) => {
  log_message = 'Updating ' + Math.round(progressObj.percent) + '%';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Installing...');
  setTimeout(() => {
    return autoUpdater.quitAndInstall();
  },3000)
});


let mainWindow
let loader;
function createWindow () {
  sendStatusToWindow('Starting...');
    mainWindow = new BrowserWindow({
      width: 1000,
      height: 600,
      webPreferences: {
        preload: __dirname + '/preload.js'
      },
      show: false 
    })
  mainWindow.on('ready-to-show', () => {
    loader.destroy();
    mainWindow.show();
    //loader.destroy();
  })
  mainWindow.loadURL('https://github.com');

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
function sendStatusToWindow(text, err) {
  if(text) console.log(text);
  if(err) console.error('Error: ' + err)
  loader.webContents.send('message', text, err);
}
app.on('ready', function() {
  loader = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  loader.loadURL('file:///' + __dirname + '/loader/index.html');
  autoUpdater.checkForUpdates();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})