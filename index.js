// Setup
var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000, function() {
    console.log('listening to requests on port 3000');
});

app.use(express.static('public'));

var io = socket(server);

var chatLog = [];
var userList = [];
var socketNicknameLog = {};

// Connection and Handling
io.on('connection', function(socket) {
    userList.push(socket.id);
    socketNicknameLog[socket.id] = socket.id;
    console.log('made socket connection', socket.id);
    socket.emit('startup', chatLog);
    io.sockets.emit('userlist', userList);

    socket.on('chat', function(data) {
        if (data.message.indexOf('/nick') != -1) {
            let nicknameTaken = false;
            let dataList = data.message.split(' ');
            for (key in socketNicknameLog) {
                if (socketNicknameLog[key] == dataList[1])
                    if (key != socket.id) {
                        socket.emit('nicktaken', '');
                        nicknameTaken = true;
                        break;
                    }
            }
            if (nicknameTaken != true) {
                userList.splice(userList.indexOf(socketNicknameLog[socket.id]), 1);
                userList.push(dataList[1]);
                socketNicknameLog[socket.id] = dataList[1];
                io.sockets.emit('userlist', userList);
                nicknameTaken = false;
            }
        }
        else {
            chatLog.push(data);
            io.sockets.emit('chat', data);
        }
    });
    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
    socket.on('disconnect', function() {
        userList.splice(userList.indexOf(socketNicknameLog[socket.id]), 1);
        io.sockets.emit('userlist', userList);
        console.log(socket.id + ' disconnected');
    });
});
