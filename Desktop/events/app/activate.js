module.exports.on = 'app';
const {app, createWindow} = require('../../main');
module.exports.func = function() {
    if (app.mainWindow === null) createWindow()
}