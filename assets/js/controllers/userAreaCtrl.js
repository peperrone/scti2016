angular.module('UserAreaCtrl', []).controller('userAreaCtrl', function($scope, $window, $location, $http, sessionService) {

    $scope.user = sessionService.getUser();
	$('#paypal').on('click', function(){
		if($('#local-pay').hasClass('active')){
    		$('#local-pay').removeClass('active waves-effect z-depth-2');
    		$('#localpay-btn').addClass('sleep');
    	}
    	$('#paypal').addClass('active waves-effect z-depth-2');
    	$('#paypal-btn').removeClass('sleep');
    });
    $('#local-pay').on('click', function(){
		if($('#paypal').hasClass('active')){
    		$('#paypal').removeClass('active waves-effect z-depth-2');
    		$('#paypal-btn').addClass('sleep');
    	}
    	$('#local-pay').addClass('active waves-effect z-depth-2');
    	$('#localpay-btn').removeClass('sleep');
    });

	var setUser = function() {
		$scope.user = sessionService.getUser();
    	$window.localStorage.token = sessionService.getToken();
	}

	var user = sessionService.getUser();
	if (!user){
		var token = $window.localStorage.token;
		if (token) {
			$http.post('/api/authenticate', {token: token}).then(function(res) {
				sessionService.setSession(res.data);
				setUser();
			}, function(err) {
				$location.path('/');
				console.log(err);
			});
		};
	} else {
		setUser();
	}


});