angular.module('MainCtrl', [])
	.controller('mainCtrl', function($scope, $window, $http, $location, sessionService) {
	
	$scope.openModal = function() {
		$('#modal1').openModal();
	};

	var token = $window.localStorage.token;
	if (token) {
		$http.post('/api/authenticate', {token: token}).then(function(res) {
			sessionService.setSession(res.data);
			$location.path('/user');
		}, function(err) {
			if (err.data.message)
				console.log(err.data.message);
		});
	}

	

});