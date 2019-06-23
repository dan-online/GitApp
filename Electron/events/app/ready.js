module.exports.on = 'app';
const {app,autoUpdater, BrowserWindow, Menu, toggleBeta, createWindow} = require('../../main');
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
    app.loader.on('ready-to-show', function() {
        app.loader.show();
    })
    app.loader.loadURL('file:///' + __dirname.split('/events')[0] + '/loader/index.html');
    if(app.config && app.config.beta) autoUpdater.allowPrerelease = true;
    autoUpdater.checkForUpdates();
}