const messages = document.querySelector('#messages');
const text = document.querySelector('#text');
const sendMsgBtn = document.querySelector('#chatform');
sendMsgBtn.addEventListener('submit', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const v = JSON.stringify({message:text.value});
    text.value = "";
    connection.send(v);
    sentMessage("⬆️ " + v);
});
let connection;
const addLog = (message) => {
    const log = document.createElement('div');
    log.textContent = message;
    log.setAttribute('class', 'log');
    messages.appendChild(log);
};
const sentMessage = (message) => {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.setAttribute('class', 'sent');
    messages.appendChild(msg);
};
const handleMessage = (message) => {
    const msg = document.createElement('div');
    msg.textContent = "⬇️ "+message;
    msg.setAttribute('class', 'message');
    messages.appendChild(msg);
};
const connectButton = document.querySelector('#connect');
connectButton.addEventListener('click', () => {
    if (connection) {
        connection.close();
        connection = null;
        return;
    }
    connection = new WebSocket(`ws://${window.location.host}/ws`);
    connection.addEventListener('open', () => {
        connectButton.textContent = "Disconnect";
        addLog('Connected');
    });
    connection.addEventListener('close', () => {
        connectButton.textContent = "Connect";
        addLog('Disconnected');

    });
    connection.addEventListener('message', (ev) => {
        handleMessage(ev.data);
    });
});

    // $(function() {
    //     var conn = null;
    //     function log(msg) {
    //       var control = $('#log');
    //       control.html(control.html() + msg + '<br/>');
    //       control.scrollTop(control.scrollTop() + 1000);
    //     }
    //     function connect() {
    //       disconnect();
    //       var wsUri = (window.location.protocol=='https:'&&'wss://'||'ws://')+window.location.host + '/ws/';
    //       conn = new WebSocket(wsUri);
    //       log('Connecting...');
    //       conn.onopen = function() {
    //         log('Connected.');
    //         update_ui();
    //       };
    //       conn.onmessage = function(e) {
    //         log('Received: ' + e.data);
    //       };
    //       conn.onclose = function() {
    //         log('Disconnected.');
    //         conn = null;
    //         update_ui();
    //       };
    //     }
    //     function disconnect() {
    //       if (conn != null) {
    //         log('Disconnecting...');
    //         conn.close();
    //         conn = null;
    //         update_ui();
    //       }
    //     }
    //     function update_ui() {
    //       var msg = '';
    //       if (conn == null) {
    //         $('#status').text('disconnected');
    //         $('#connect').html('Connect');
    //       } else {
    //         $('#status').text('connected (' + conn.protocol + ')');
    //         $('#connect').html('Disconnect');
    //       }
    //     }
    //     $('#connect').click(function() {
    //       if (conn == null) {
    //         connect();
    //       } else {
    //         disconnect();
    //       }
    //       update_ui();
    //       return false;
    //     });
    //     $('#send').click(function() {
    //       var text = $('#text').val();
    //       log('Sending: ' + text);
    //       conn.send(text);
    //       $('#text').val('').focus();
    //       return false;
    //     });
    //     $('#text').keyup(function(e) {
    //       if (e.keyCode === 13) {
    //         $('#send').click();
    //         return false;
    //       }
    //     });
    //   });