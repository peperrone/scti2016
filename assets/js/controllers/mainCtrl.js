angular.module('MainCtrl', [])
	.controller('mainCtrl', function($scope) {

	$scope.openModal = function() {
		$('#modal1').openModal();
	}

});