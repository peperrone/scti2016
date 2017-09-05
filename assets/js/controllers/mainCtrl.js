angular.module('MainCtrl', [])
	.controller('mainCtrl', function($scope, $location, sessionService) {

	$scope.loading = true;
	$scope.openModal = function() {
		$('#modal1').openModal();
	};

  $scope.sendGaEvent = function() {
    ga('send', 'event', 'outbound-link', 'click', 'inscreva-se');
  }

	sessionService.checkAuth(function(isAuthenticated){
		$scope.loading = false;
	});

  $scope.$on('$viewContentLoaded', function(event) {
    ga('set', 'page', '/');
    ga('send', 'pageview');
  });
	
});
