angular.module('SignupCtrl', []).controller('signupCtrl', function($scope, $http, $location, sessionService) {

	$scope.user = {};

    $scope.signup = function(){
    	$scope.invalidEmail = false;
    	$scope.invalidPassword = false;
    	$scope.emailError = "Insira um email válido!";

    	var user = $scope.user;
    	if (!user || !user.email || !user.password || !user.name || !$scope.password2) return;

    	if (user.password.length < 5){
	    	$scope.invalidPassword = true;
	    	return;
	    }

    	if ($scope.password2 != user.password) {
    		$('#password2').removeClass("valid").addClass("invalid");
	    	return;
	    } else {
	    	$('#password2').removeClass("invalid");
	    }

    	var successCallback = function (res) {
    		if (res.data.success){
    			$('#modal1').closeModal();
    			$http.post('/api/signin', user).then(function(response){
    				if (response.status === 200){
	    				sessionService.setSession(response.data);
	    				$location.path('/user');
	    			} else {
	    				console.log(response);
	    			}
    			}, function(err){
    				console.log(err);
    			});
    		}
    		sessionService.setSession(res.data);
    		$location.path('/user');
    	};

    	var errorCallback = function (res) {
    		if (res.status === 409) {
    			$scope.emailError = "Email já em uso!";
    			$scope.invalidEmail = true;
	    		return;
    		}
    	};

    	$http.post('/api/signup', user).then(successCallback, errorCallback);
    	
    }
    
});