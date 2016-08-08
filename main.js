"use strict";

var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var bubbles = angular.module('bubbles', []);
var bubblesController = bubbles.controller('bubblesController', ['$scope', function ($scope) {

    $scope.innerWidth = window.innerWidth - 20;
    $scope.innerHeight = window.innerHeight - 20;
    $scope.bubbles;
    $scope.player;
    var endGame;
    var pepe = [];

    socket.on('numberOfUsers', function (data) {
        console.log("users " + data);
        if (data < 1) {
            //            $scope.bubbles = createBubbles();
            socket.emit('sendBubbles', createBubbles());
        }
        $scope.player = createPlayer(data);
        socket.emit('newPlayer', $scope.player);
        $scope.$digest();
        updatePlayer();
    });

    socket.on('AllBubbles', data => {
        $scope.bubbles = data;
        $scope.$digest();
        console.log("AllBubbles: " + JSON.stringify($scope.bubbles));
    });

    socket.on('newBubble', function (data) {
        $scope.bubbles.push(data);
        console.log("new bubble : " + JSON.stringify(data));
        $scope.$digest();
    });

    socket.on('getUpdateBubble', function (data) {
        var index = $scope.bubbles.map((element, index) => {
            if (element.id === data.id) {
                return index;
            } else return null;
        }).find(a => a != null);
        $scope.bubbles[index] = data;
        $scope.$digest();
    });

    function updatePlayer() {
        var speed;
        var player = $scope.player;
        if (player.size > 150) {
            speed = 1;
        } else if (player.size > 75) {
            speed = 2;
        } else {
            speed = 3;
        }

        if (player.left) {
            player.posX = player.posX + speed;
        } else {
            player.posX = player.posX - speed;
        }
        if (player.top) {
            player.posY = player.posY + speed;
        } else {
            player.posY = player.posY - speed;
        }

        //limites de la pantalla para que rebote
        if (player.posX > (window.innerWidth - (player.size / 2))) {
            player.left = false;
        }
        if (player.posX < 0 + (player.size / 2)) {
            player.left = true;
        }
        if (player.posY > (window.innerHeight - (player.size / 2))) {
            player.top = false;
        }
        if (player.posY < 0 + (player.size / 2)) {
            player.top = true;
            ;
        }

        socket.emit('updateBubble', player);
        $scope.player = player;
        $scope.$digest();
        endGame = setTimeout(updatePlayer, 50);
    }



    function Bubble(size, type) {
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
        var numberOfBubbles = 20;
        var type = true;
        for (var i = 0; i < numberOfBubbles; i++) {
            var size = 5 + Math.floor(Math.random() * 30);
            var bubble = new Bubble(size, (type) ? "red" : "orange");
            bubbles.push(bubble);
            type = !type;
        }
        return bubbles;
    };

    var createPlayer = id => {
        var player = new Bubble(10, "blue");
        var playerName = window.prompt("Nombre de jugaor?");
        player.playerName = playerName != null ? playerName : "Desconocido";
        player.id = id;
        return player;
    };

    $scope.move = index => {
        this.bubbles.map((element, index) => {
            if (element.id === id) {
                return index;
            } else return null;
        }).find(a => a != null);
        console.log(index);
        this.bubbles[index].x = this.bubbles[index].x + 5;
    };

}]);