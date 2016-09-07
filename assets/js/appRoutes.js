angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	    .when('/', {
	        templateUrl: 'routes/home',
	        controller: 'mainCtrl'
	    })
	    .when('/user', {
	        templateUrl: 'routes/user',
	        controller: 'userAreaCtrl'
	    });
	$locationProvider.html5Mode(true);
}]);