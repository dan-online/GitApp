module.exports.on = 'autoUpdater';

module.exports.func = function(err) {
    require("../../main").sendStatusToWindow('Error in update!', err);
    setTimeout(() => {
        require("../../main").createWindow();
    },3000)
}