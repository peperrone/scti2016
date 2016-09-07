angular.module('MainCtrl', []).controller('mainCtrl', function($scope, $location) {

    $scope.login = function(){
    	$('#modal2').closeModal();
    	$location.path('/user');
    }

});