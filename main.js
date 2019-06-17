
const {app, BrowserWindow} = require('electron');

const { autoUpdater } = require("electron-updater")

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
  createWindow();
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in update!');
  createWindow();
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  createWindow();
});


let mainWindow
let loader;
function createWindow () {
  // Create the browser window.
  loader.destroy();
    autoUpdater.checkForUpdates();
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: __dirname + '/preload.js'
      },
      show: false 
    })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    //loader.destroy();
  })
  mainWindow.loadURL('https://github.com')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
function sendStatusToWindow(text) {
  loader.webContents.send('message', text);
}
app.on('ready', function() {
  loader = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
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