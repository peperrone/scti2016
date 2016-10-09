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
		if (!newName) return;
		var url = 'api/users/' + $scope.user._id + '/changeName';
		$http.put(url, {token: sessionService.getToken(), name: newName}).then(function(res){
			$scope.newName = "";
			$scope.user = res.data.user;
			sessionService.setSession({token: sessionService.getToken(), user: $scope.user});
		}, function(err){
			console.log(err);
		})
	}

	$scope.changeEmail = function(newEmail){
		//TODO: http request
	}

});
