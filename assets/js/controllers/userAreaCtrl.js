angular.module('UserAreaCtrl', []).controller('userAreaCtrl', function($scope, $window, $location, $http, sessionService) {
	$scope.loading = true;
	$scope.loadingGiftCode = false;


	$scope.openModal = function() {
		$('#modal3').openModal();
	};

	$scope.validateEmail = function() {
		if ($scope.verificationCode) {
			var url = 'api/users/' + $scope.user._id + '/validate';
			$http.post(url, {token: sessionService.getToken(), verificationCode: $scope.verificationCode}).then(function(res) {
				$scope.user = res.data.user;
				alert("Email verificado com sucesso!");
			}, function(err) {
				console.log(err);
				if (err.data.message.includes("authenticate token")) {
					sessionService.setSession({});
					$location.path('/');
				}
				$('#verification-code-input').addClass("invalid").removeClass("valid");
			});
		} else {
			alert("Código inválido!");
			$('#verification-code-input').removeClass("valid").addClass("invalid");
		}
	};

	var user = sessionService.getUser();

	if (!user){
		var token = $window.localStorage.token;
		if (token) {
			$http.post('/api/authenticate', {token: token}).then(function(res) {
				$scope.loading = false;
				sessionService.setSession(res.data);
				$scope.user = res.data.user;
				console.log(res.data.user);
    			$window.localStorage.token = res.data.token;
			}, function(err) {
				$location.path('/');
			});
		};
	} else {
		$scope.loading = false;
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
	    	$scope.loadingGiftCode = true;
	    	$http.post(url, {user: $scope.user, giftCode: $scope.giftCode, token: sessionService.getToken()}).then(function(res) {
				$scope.loadingGiftCode = false;
				$('#modal3').closeModal();
				$scope.user = res.data.user;
				alert("Pagamento confirmado com sucesso!");
			}, function(err) {
				$scope.loadingGiftCode = false;
				$('#labelGiftCode').attr("data-error", "Código inválido!");
				$('#giftCode').addClass("invalid").removeClass("valid");
			});
	    }
    }
});