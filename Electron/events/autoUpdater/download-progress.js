module.exports.on = 'autoUpdater';

module.exports.func = function(progressObj) {
    log_message = 'Updating ' + Math.round(progressObj.percent) + '%';
    require('../../main').sendStatusToWindow(log_message);
}