angular.module('LoginCtrl', []).controller('loginCtrl', function($scope, $http, $location, sessionService) {

    $scope.loading = false;
    $scope.login = function(){
    	$scope.invalidEmail = false;
    	$scope.invalidPassword = false;

    	var user = $scope.user;
    	if (!user || !user.email || !user.password) return;

    	var successCallback = function (res) {
            $scope.loading = false;
    		$('#modal2').closeModal();
    		sessionService.setSession(res.data);
    		$location.path('/user');
    	};

    	var errorCallback = function (res) {
            $scope.loading = false;
    		if (res.data.message.includes("User not found")) {
    			$scope.invalidEmail = true;
    		} else {
    			$scope.invalidPassword = true;
    		}
    	};

    	$http.post('/api/signin', user).then(successCallback, errorCallback);
    	$scope.loading = true;
    };
    
});