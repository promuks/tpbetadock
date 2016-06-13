'use strict';

/**
 * @ngdoc function
 * @name app.websocketsDemo.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the app.websocketsDemo
 */
angular.module('app.websocketsDemo')
  .controller('MessageCtrl', function ($scope,$filter,$log) {

    $scope.connected=false;
    $scope.destination = 'Developers Rule';
    $scope.msgFromServer='';
    $scope.source = 'comingfrommv';
    $scope.socket = {
      client: null,
      stomp: null
    };

    $scope.initSockets = function() {
      $scope.socket.client = new SockJS('http://localhost:8080/hello');
      $scope.socket.stomp = Stomp.over($scope.socket.client);
      $scope.socket.stomp.connect({}, function(frame) {
        $scope.connected=true;
        $log.log('Connected: ' + frame);
        $scope.socket.stomp.subscribe("/topic/greetings/"+$scope.source, function(greeting){
          //showGreeting(JSON.parse(greeting.body).content);
          $scope.msgFromServer = $scope.msgFromServer.concat(' : '+JSON.parse(greeting.body).content);
          $log.log('returning: '+$scope.msgFromServer);
          $scope.$apply();
        });
      });
      $scope.socket.client.onclose = $scope.reconnect;
    };

    $scope.initSockets();

    $scope.submitSearch = function (searchForm) {
      $log.log('printing'+$scope.destination);
      var name = $scope.destination;
      $scope.socket.stomp.send("/app/hello", {}, JSON.stringify({ 'name': name, 'source': $scope.source }));
    };

    $scope.disconnect = function () {
      if ($scope.socket.stomp != null) {
        $scope.socket.stomp.disconnect();
      }
      $scope.connected=false;
      $log.log("Disconnected");
    }

    $scope.reconnect = function() {
      setTimeout($scope.initSockets, 10000);
    };

  });

