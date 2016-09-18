angular.module('MainCtrl', [])
	.controller('mainCtrl', function($scope, $location, sessionService) {
	
	$scope.loading = true;
	$scope.openModal = function() {
		$('#modal1').openModal();
	};

	sessionService.checkAuth(function(isAuthenticated){
		$scope.loading = false;
	});
});