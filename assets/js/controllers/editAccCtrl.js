angular.module('EditAccCtrl', []).controller('editAccCtrl', function($scope, $http, $location, sessionService) {

	$scope.loading = true;

	var user = sessionService.getUser();
	if (!user){
		sessionService.checkAuth(function(isAuthenticated){
			if (isAuthenticated){
				$scope.loading = false;
				$('.collapsible').collapsible();
				$scope.user = sessionService.getUser();
			} else {
				$location.path('/');
			}
		});
	} else {
		$scope.loading = false;
		$('.collapsible').collapsible();
		$scope.user = user;
	}

	$scope.changeName = function(newName){
		//TODO: http request
	}

	$scope.changeEmail = function(newEmail){
		//TODO: http request
	}

});