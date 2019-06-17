const {ipcRenderer} = require('electron');
          ipcRenderer.on('message', function(event, text) {
          var m = document.getElementById('messages');
          m.innerHTML = text;
    })