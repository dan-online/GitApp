window.addEventListener('DOMContentLoaded', () => {
    
    const customTitlebar = require('custom-electron-titlebar');
 
    const titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#24292e'),
    });
    titlebar.updateTitle('GitApp - ' + require('./package.json').version);
    const div = document.getElementsByTagName('header')[0];
    div.setAttribute('style', 'position:fixed!important');
    div.style.top = '10';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.zIndex = '99998';
    const main = document.getElementsByTagName('main')[0];
    const first = main.getElementsByTagName('div')[0];
    first.style.paddingTop = '10%';
});