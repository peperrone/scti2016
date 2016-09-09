angular.module('UserAreaCtrl', []).controller('userAreaCtrl', function($scope, $window, $location, $http, sessionService) {

	$scope.openModal = function() {
		$('#modal3').openModal();
	};

	$scope.validateEmail = function() {
		if ($scope.verificationCode) {
			var url = 'api/users/' + $scope.user._id + '/validate';
			$http.post(url, {token: token, verificationCode: $scope.verificationCode}).then(function(res) {
				$scope.user = res.data.user;
				alert("Email verifiado com sucesso!");
			}, function(err) {
				console.log(err);
				$('#verification-code-input').addClass("invalid").removeClass("valid");
			});
		} else {
			$('#verification-code-input').removeClass("valid").addClass("invalid");
		}
	};

	var user = sessionService.getUser();

	if (!user){
		var token = $window.localStorage.token;
		if (token) {
			$http.post('/api/authenticate', {token: token}).then(function(res) {
				sessionService.setSession(res.data);
				$scope.user = res.data.user;
    			$window.localStorage.token = res.data.token;
			}, function(err) {
				$location.path('/');
			});
		};
	} else {
		$scope.user = sessionService.getUser();
    	$window.localStorage.token = sessionService.getToken();
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
    	if (!$scope.giftCode) {
    		$('#labelGiftCode').removeClass("data-error");
    		$('#giftCode').addClass("invalid").removeClass("valid");
    	} else {
	    	var url = '/api/users/' + $scope.user._id + '/validateGiftCode';
	    	$http.post(url, {user: $scope.user, giftCode: $scope.giftCode, token: sessionService.getToken()}).then(function(res) {
				$('#modal3').closeModal();
				$scope.user = res.data.user;
				alert("Pagamento confirmado com sucesso!");
			}, function(err) {
				$('#labelGiftCode').attr("data-error", "Código inválido!");
				$('#giftCode').addClass("invalid").removeClass("valid");
			});
	    }
    }
});