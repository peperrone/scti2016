angular.module('HeaderCtrl', []).controller('headerCtrl', function($scope, $location, sessionService) {

	$scope.$watch(function(){
    	return sessionService.getUser();
	}, function (newUser, oldUser) {
	    $scope.user = newUser;
	});

	$scope.logout = function() {
		sessionService.setSession({});
		$location.path('/');
	}
    
});