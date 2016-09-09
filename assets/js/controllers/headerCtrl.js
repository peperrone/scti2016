angular.module('HeaderCtrl', []).controller('headerCtrl', function($scope, $window, $location, sessionService) {

	$scope.$watch(function(){
    	return sessionService.getUser();
	}, function (newUser, oldUser) {
	    $scope.user = newUser;
	});

	$scope.logout = function() {
		sessionService.setSession({});
		$window.localStorage.token = null;
		$location.path('/');
	};

	$scope.openModal = function() {
		$('#modal2').openModal();
	};
    
});