"use strict";

var socket = io.connect('http://localhost:3000', { 'forceNew': true });

var bubbles = angular.module('bubbles', []);
var bubblesController = bubbles.controller('bubblesController', ['$scope', function ($scope) {

    $scope.innerWidth = window.innerWidth - 20;
    $scope.innerHeight = window.innerHeight - 20;

    socket.on('numberOfUsers', function (data) {
        console.log("users " + data);
        if (data < 1) {
            $scope.bubbles = createBubbles();
            socket.emit('sendBubbles', $scope.bubbles);
        }
        $scope.$digest();
    })

    socket.on('AllBubbles', data => {
        $scope.bubbles = data; 
        $scope.$digest(); 
        //console.log("AllBubbles: " + data);
    });

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