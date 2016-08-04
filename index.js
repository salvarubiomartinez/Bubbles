var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    users = 0,
    bubbles = [];

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //  res.sendfile('main.js');
});

app.get('/main.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/main.js'));
});

app.get('/angular.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/node_modules/angular/angular.js'));
});

http.listen(3000, function () {
    console.log("Node server running on http://localhost:3000");
})

io.on('connection', function (socket) {
    console.log('a user connected ' + users);
    socket.emit('numberOfUsers', users);
    
    if (users > 0){
        socket.emit('AllBubbles', bubbles);
    }

    socket.on('sendBubbles', function (data){
        bubbles = data;
        console.log(bubbles);
    })

    users++;
    socket.on('disconnect', function () {
        console.log('user disconnected');
        users = users - 1 ;
    });

    socket.on('newPlayer', function(data){
        bubbles.push(data);
        socket.broadcast.emit('newBubble', data);
    });

    socket.on('new-message', function (params) {
        socket.broadcast.emit('messages', params.content);
    });

});

