angular.module('EditAccCtrl', []).controller('editAccCtrl', function($scope, $http, $location, sessionService) {

	setTimeout(function(){
	   $('select').material_select();
	}, 0);
	
	$scope.loading = true;
	$scope.invalidPassword = false;

	var user = sessionService.getUser();
	if (!user){
		sessionService.checkAuth(function(isAuthenticated){
			if (isAuthenticated){
				$scope.loading = false;
				$('.collapsible').collapsible();
				$scope.user = sessionService.getUser();
			} else {
				$location.path('/');
			}
		});
	} else {
		$scope.loading = false;
		$('.collapsible').collapsible();
		$scope.user = user;
	}

	$scope.changeName = function(newName){
		if (!newName) return;
		$scope.loading = true;
		var url = 'api/users/' + $scope.user._id + '/changeName';
		$http.put(url, {token: sessionService.getToken(), name: newName}).then(function(res){
			$scope.newName = "";
			$scope.user = res.data.user;
			sessionService.setSession({token: sessionService.getToken(), user: $scope.user});
			$scope.loading = false;
		}, function(err){
			console.log(err);
			$scope.loading = false;
		})
	};

	$scope.changeEmail = function(newEmail){
		if (!newEmail) return;
		$scope.loading = true;
		var user = {};
		user.email = newEmail;
		var url = 'api/users/' + $scope.user._id + '/changeEmail';
		$http.put(url, {token: sessionService.getToken(), email: newEmail, user: user}).then(function(res){
			$scope.newEmail = "";
			$scope.user = res.data.user;
			sessionService.setSession({token: sessionService.getToken(), user: $scope.user});
			$scope.loading = false;
			alert("Um código de verificação foi enviado para seu novo email!");
		}, function(err){
			alert("Oops, algo deu errado :( Tente novamente mais tarde");
			console.log(err);
			$scope.loading = false;
		})
	};

	$scope.changePassword = function(){
		if (!$scope.password || !$scope.newPassword || !$scope.newPassword2) return;

		if ($scope.newPassword.length < 5){
	    	$scope.invalidPassword = true;
	    	return;
	    }

	    if ($scope.newPassword2 != $scope.newPassword) {
    		$('#newPasswordChange2').removeClass("valid").addClass("invalid");
	    	return;
	    } else {
	    	$('#newPasswordChange2').removeClass("invalid");
	    }
	    $scope.loading = true;
		var url = 'api/users/' + $scope.user._id + '/changePassword';
		$http.put(url, {token: sessionService.getToken(), oldPassword: $scope.password, newPassword: $scope.newPassword}).then(function(res){
			$scope.password = "";
			$scope.newPassword = "";
			$scope.newPassword2 = "";
			$scope.user = res.data.user;
			sessionService.setSession({token: sessionService.getToken(), user: $scope.user});
			alert("Senha alterada com sucesso!");
			$scope.loading = false;
		}, function(err){
			if (err.status === 401) {
				$('#passwordChange').removeClass("valid").addClass("invalid");
			}
			$scope.loading = false;
		})
	}

});
