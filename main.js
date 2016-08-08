"use strict";

var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var bubbles = angular.module('bubbles', []);
var bubblesController = bubbles.controller('bubblesController', ['$scope', function ($scope) {

    $scope.innerWidth = window.innerWidth - 20;
    $scope.innerHeight = window.innerHeight - 20;
    $scope.bubbles = [];
    $scope.player;
    var endGame;

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
        var index = getIndexById(data.id);
        $scope.bubbles[index] = data;
        $scope.$digest();
    });

//    socket.on('deleteBubble', function (bubbleId) {
//        var index = getIndexById(bubbleId);
//        $scope.bubbles.splice(bubbleId, 1);
//    });

    function getIndexById(id) {
        return $scope.bubbles.map((element, index) => {
            if (element.id === id) {
                return index;
            } else return null;
        }).find(a => a != null);
    }

//    function deleteBubble(bubbleId) {
//        socket.emit('deleteBubbleSend', bubbleId);
//    }

    $scope.changeDirection = function () {
        var player = $scope.player;
        console.log("giro");
        if (player.left && player.top) {
            player.left = false;
        } else
            if (!player.left && player.top) {
                player.top = false;
            } else
                if (!player.left && !player.top) {
                    player.left = true;
                } else
                    if (player.left && !player.top) {
                        player.top = true;
                    }
    };

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
        if ($scope.bubbles.length > 0) {
            $scope.bubbles.forEach(
                (item, index) => {
                    if (crash(item, player)) {
                        if (player.size >= item.size) {
                            
                            if (item.size > 0) {
                                player.size++;
                                item.size--;
                            }
                            //$scope.bubbles[index].size--;
                        } else {
                            if (player.size > 0) {
                                player.size--;
                                item.size++;
                            }                       
                        }
                        socket.emit('updateBubble', item);
                    }
                }
            );
        }


        socket.emit('updateBubble', player);
        $scope.player = player;
        $scope.$digest();
        endGame = setTimeout(updatePlayer, 50);
    }

    function crash(bubble1, bubble2) {
        var r1 = bubble1.size / 2;
        var r2 = bubble2.size / 2;
        var distance = parseInt(Math.sqrt((Math.pow((bubble1.posX - bubble2.posX), 2) + Math.pow((bubble1.posY - bubble2.posY), 2))));
        if (distance < (r1 + r2)) {
            return true;
        } else {
            return false;
        }
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

}]);


angular.forEach(['cx', 'cy', 'width', 'height', 'r'], function (name) {
    var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
    bubbles.directive(ngName, function () {
        return function (scope, element, attrs) {
            attrs.$observe(ngName, function (value) {
                attrs.$set(name, value);
            });
        };
    });
});