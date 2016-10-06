angular.module('ForgotPasswordCtrl', []).controller('forgotPasswordCtrl', function($scope, $http, $location, sessionService) {
	$scope.loading = true;

	var user = $scope.user;
	sessionService.checkAuth(function(isAuthenticated){
		if (isAuthenticated){
			$location.path('/user');
		} else {
			$scope.loading = false;
		}
	});

	$scope.sendEmail = function(data) {
		$scope.loading = true;
        var url = '/api/lostPassword/';
        if($scope.email){
        	$http.post(url, {email: $scope.email}).then(function(res) {
        		$scope.loading = false;
            	alert("Um link para redefinir sua senha foi enviado para seu e-mail!");
            	$location.path('/');
            }, function(err) {
            	$scope.loading = false;
                if (err.data && err.data.message.includes("User not found")) {
	    			$('#emailP2').removeClass("valid").addClass("invalid");
	    		} else {
	    			alert("Internal server error! Tente novamente mais tarde!");
	    			$location.path('/');
	    		}
            });
        } else {
        	$scope.loading = false;
        	$('#emailP2').removeClass("valid").addClass("invalid");
        }
	}
});
