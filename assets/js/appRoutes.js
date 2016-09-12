angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	    .when('/', {
	        templateUrl: 'routes/home',
	        controller: 'mainCtrl'
	    })
	    .when('/forgotpassword', {
	        templateUrl: 'routes/forgotpassword',
	        controller: 'forgotPasswordCtrl'
	    })
	    .when('/user', {
	        templateUrl: 'routes/user',
	        controller: 'userAreaCtrl'
	    });
	$locationProvider.html5Mode(true);
}]);