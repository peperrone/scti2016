angular.module('UserAreaCtrl', []).controller('userAreaCtrl', function($scope, $window, $location, $http, sessionService) {

	$scope.openModal = function() {
		$('#modal3').openModal();
	};

    $scope.user = sessionService.getUser();
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
			});
		};
	} else {
		setUser();
	}

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

    $scope.confirmGiftCode = function(){
    	$http.post('/api/confirmGiftCode', {giftCode: $scope.giftCode}).then(function(res) {
			//TODO: Confirm payment
			$('#modal3').closeModal();
		}, function(err) {
			$('#giftCode').addClass("invalid").removeClass("valid");
		});
    }
});