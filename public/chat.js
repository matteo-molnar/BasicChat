// Connect
var socket = io.connect('http://localhost:3000');

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    userlist = document.getElementById('user-list');

var nickname = 'DefaultUser';

// Emit Events
btn.addEventListener('click', function() {
    if (message.value.indexOf("/nick") != -1)
        nickname = message.value.split(' ')[1];
    let d = new Date();
    let timestamp = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    socket.emit('chat', {
        message: message.value,
        handle: nickname,
        timestamp: timestamp
    });
    message.value = "";
});

message.addEventListener('keypress', function() {
    socket.emit('typing', handle.value);
});

// Listen for events
socket.on('startup', function(data) {
    for (let i = 0; i < data.length; i++) {
        output.innerHTML += '<p><strong>' + data[i].handle + ' (' + data[i].timestamp + ')' + ': </strong>' + data[i].message + '</p>';
    }
});

socket.on('nicktaken', function() {
    nickname = "DefaultUser";
})

socket.on('userlist', function(data) {
    userlist.innerHTML = '';
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        userlist.innerHTML += '<p><strong>' + data[i] + '</strong></p>';
    }
    feedback.innerHTML = '';
});

socket.on('chat', function(data) {
    console.log(data);
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ' (' + data.timestamp + ')' + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data) {
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
