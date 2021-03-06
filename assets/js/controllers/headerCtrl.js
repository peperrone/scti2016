angular.module('HeaderCtrl', []).controller('headerCtrl', function($scope, $window, $location, sessionService) {

	sessionService.checkAuth(function(isAuthenticated){
		return;
	});

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

	$scope.openSignupModal = function() {
		$('#modal1').openModal();
	};

	$scope.closeSideNav = function() {
		$('.button-collapse').sideNav('hide');
	};

	$scope.sendGaHomePageview = function() {
    ga('send', 'pageview', '/');
  }
    
});