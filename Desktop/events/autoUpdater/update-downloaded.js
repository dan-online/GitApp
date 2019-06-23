module.exports.on = 'autoUpdater';

module.exports.func = function() {
    require("../../main").sendStatusToWindow('Installing...');
    setTimeout(() => {
      return require("../../main").autoUpdater.quitAndInstall();
    },3000)
}