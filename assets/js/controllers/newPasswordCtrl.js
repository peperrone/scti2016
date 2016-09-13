angular.module('NewPasswordCtrl', []).controller('newPasswordCtrl', function($scope, $http, $routeParams, $location) {
	$scope.isLoading = true;
	$http.get('api/resetCode/' + $routeParams.resetCode).then(function(res) {
		$scope.isLoading = false;
	}, function(err) {
		$location.path('/');
	});

	$scope.newPassword = function() {
		$scope.invalidPassword = false;
    	if ($scope.password.length < 5){
	    	$scope.invalidPassword = true;
	    } else if ($scope.password2 != $scope.password) {
	    	$('#password2').removeClass("valid").addClass("invalid");
	    } else {
	    	$('#password2').removeClass("invalid");
	    	$http.put('api/resetPassword', {resetCode: $routeParams.resetCode, newPassword: $scope.password}).then(function(res) {
	    		alert("Senha alterada com sucesso! Faça login pra continuar!");
	    		$location.path('/');
			}, function(err) {
				alert("Não foi possível alterar sua senha!");
				console.log(err);
			});
	    }
	}
});
