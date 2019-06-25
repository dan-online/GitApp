module.exports.on = 'app';
const isOnline = require('is-online');
const {app,autoUpdater, BrowserWindow, Menu, toggleBeta, createWindow, sendStatusToWindow} = require('../../main');
module.exports.func = function() {
    try {app.config = require(app.getPath('userData') + '/data.json')} catch (err) {app.config = null;}
    if(!app.config) var beta = 'Enable Beta';
        else var beta = 'Disable Beta';
    const menuTemplate = [
        {
          label: 'GitApp',
          submenu: [
              {
                label: beta,
                click: toggleBeta
              },
               {
                  type: 'separator'
              }, {
                  label: 'Quit',
                  role: 'quit'
              }
          ]
      },
      {
          label: 'File',
          submenu: [
            {
                label: 'Close',
                role: 'close'
            },
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Copy',
                role: 'copy'
            },
            {
                label: 'Paste',
                role: 'paste'
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
    })
    app.loader.webContents.on('dom-ready', function() {
        app.loader.show();
        sendStatusToWindow('Loading GitApp...');
    });
    app.loader.loadURL('file:///' + __dirname.split('/events')[0] + '/web/loader/index.html');
    const checkOnline = async () => {
        let online = await isOnline();
        if(!online) {
            sendStatusToWindow('No internet! Trying again in <span id="s">3</span> seconds')
            return wait = true;
        } else {
            if(app.config && app.config.beta) autoUpdater.allowPrerelease = true;
            autoUpdater.checkForUpdates();
            clearInterval(i);
        }
    }
    checkOnline();
    var i = setInterval(checkOnline, 4000)
}