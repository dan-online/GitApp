const {ipcRenderer, shell} = require('electron')
window.onload = function () {
    ipcRenderer.send('fetch_notifs');
    ipcRenderer.on('notifs', function(err, notifs) {
        if(!notifs) notifs = [];
        const notifications = Array.from(document.getElementsByClassName('list-group-item js-notification'));
        console.log(notifications)
        notifications.forEach(n => {
            if(notifs.indexOf(n.getElementsByTagName('a')[0].innerText) >= 0) return;
            if(Array.from(n.classList).filter(x => x.endsWith('-notification'))[Array.from(n.classList).filter(x => x.endsWith('-notification')).length -1]) {
                var text = Array.from(n.classList).filter(x => x.endsWith('-notification'))[Array.from(n.classList).filter(x => x.endsWith('-notification')).length -1];
                text = text.split('-notification')[0];
                text = Array.from(text);
                text[0] = text[0].toUpperCase();
                text = text.join('');
                text = text.toString();
                text += ' notification';
            } else {
                text = 'Notification!'
            }
            var sent = new Notification(text, {
                body: n.parentElement.parentElement.innerText.split('/')[0] + '/' + n.parentElement.parentElement.innerText.split('/')[1].split(`
    `)[0] + ' - ' + n.getElementsByTagName('a')[0].innerText
            });
            sent.onclick = function() {
                ipcRenderer.send('clicked_notif', n.getElementsByTagName('a')[0].href)
            }
            ipcRenderer.send('viewed_notif', n.getElementsByTagName('a')[0].innerText)
        })
    })
};
