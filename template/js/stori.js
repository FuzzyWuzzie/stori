var storiApp = angular.module('storiApp', ['ui.router']);

storiApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /login
  $urlRouterProvider.otherwise("/projects");
  //
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html"
    })
    .state('projects', {
      url: "/projects",
      templateUrl: "views/projects.html",
      controller: function($scope) {
      	$scope.projects = [
      		{ name: "Media 101", description: "Virtual reality media training" },
      		{ name: "MedBIKE", description: "Cycling excerise enhanced by virtual reality." }
      	];
      }
    });
});