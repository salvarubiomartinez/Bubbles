"use strict";

var socket = io.connect('http://localhost:3000', { 'forceNew': true });

//socket.on('messages', function (data) {
//    console.log(data);
//    var texto = document.getElementById("texto");
//    var t = document.createTextNode(data + '</br>');
//    texto.appendChild(t);
//});

function envia() {
    var mensaje = document.getElementById('mensaje').value;
    socket.emit('new-message', { content: mensaje });
}

var bubbles = angular.module('bubbles', []);
var bubblesController = bubbles.controller('bubblesController', ['$scope', function ($scope) {

    socket.on('messages', function (data) {
        $scope.bubbles.forEach(function (element) {
            element.x = element.x + 15;
        });
        $scope.$digest();
    });

    $scope.innerWidth = window.innerWidth;
    $scope.innerHeight = window.innerHeight;

    socket.on('numberOfUsers', function (data) {
        console.log("users " + data);
        if (data < 1) {
            $scope.bubbles = createBubbles();
            socket.emit('sendBubbles', $scope.bubbles);
        }
        $scope.$digest();
    })

    socket.on('AllBubbles', data => { $scope.bubbles = data; $scope.$digest(); console.log("AllBubbles: " + data); });


    function Star(size, type) {
        this.id;
        this.posX = Math.floor(Math.random() * window.innerWidth);
        this.posY = Math.floor(Math.random() * window.innerHeight);
        this.size = size;
        this.type = type;
        this.left = true;
        this.top = true;
        this.playerName = null;
    }

    var createBubbles = _ => {
        var bubbles = [];
        var numberOfStars = 20;
        var type = true;
        for (var i = 0; i < numberOfStars; i++) {
            var size = 5 + Math.floor(Math.random() * 30);
            var star = new Star(size, (type) ? "red" : "orange");
            bubbles.push(star);
            type = !type;
        }
        return bubbles;
    };

    $scope.hola = "pepepe";

    $scope.move = index => {
        this.bubbles.map((element, index) => {
            if (element.id === id) {
                return index;
            } else return null;
        }).find(a => a != null);
        console.log(index);
        this.bubbles[index].x = this.bubbles[index].x + 5;
    };
    $scope.enviar = a => {
        $scope.bubbles.forEach(function (element) {
            element.x = element.x + 5;
        }, this);
        socket.emit('new-message', { content: "mensaje" });
    };
}]);