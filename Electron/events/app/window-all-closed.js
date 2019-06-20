module.exports.on = 'app';
const {app} = require('../../main');
module.exports.func = function() {
    if (process.platform !== 'darwin') app.quit()
}