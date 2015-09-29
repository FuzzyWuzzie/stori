var storiApp = angular.module('storiApp', []);

storiApp.controller('mainController', function($scope) {
	$scope.message = 'Main controller saying hi!';
});