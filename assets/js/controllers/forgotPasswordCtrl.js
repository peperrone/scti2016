angular.module('ForgotPasswordCtrl', []).controller('forgotPasswordCtrl', function($scope, $window, $http) {
	
	var user = $scope.user;
	$scope.sendEmail = function(data) {
            var url = '/api/lostPassword/';
            if(user){
            	$http.post(url, user).then(function(res) {
                alert("Um link para redefinir sua senha foi enviado para seu e-mail!");
	            }, function(err) {
	                console.log(err);
	            });
            }  
        }
});
