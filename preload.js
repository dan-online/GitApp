window.onload = function() {
    const div = document.getElementsByTagName('header')[0];
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.zIndex = '9999999999999999';
    document.getElementsByClassName('main')[0].style.paddingTop = '7%';
}