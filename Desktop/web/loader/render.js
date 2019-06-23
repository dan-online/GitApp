const {ipcRenderer} = require('electron');
          ipcRenderer.on('message', function(event, text,err) {
                if(err) {
                      console.error(err);
                }
          var m = document.getElementById('messages');
          m.innerHTML = text;
          
    })