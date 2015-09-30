var storiApp = angular.module('storiApp', ['ui.router']);

storiApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/home");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html",
      controller: function($scope) {
      	$scope.message = "hey hey";
      }
    });
});