window.addEventListener('DOMContentLoaded', () => {
    const div = document.getElementsByTagName('header')[0];
    div.setAttribute('style', 'position:fixed!important');
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.zIndex = '9999999999999999';
    const main = document.getElementsByTagName('main')[0];
    const first = main.getElementsByTagName('div')[0];
    first.style.paddingTop = '10%';
});