module.exports.on = 'app';
const {app,autoUpdater, BrowserWindow} = require('../../main');
module.exports.func = function() {
    app.loader = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    })
    app.loader.on('ready-to-show', function() {
        app.loader.show();
    })
    app.loader.loadURL('file:///' + __dirname.split('/events')[0] + '/loader/index.html');
    autoUpdater.checkForUpdates();
}