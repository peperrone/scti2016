angular.module('WorkshopsCtrl', []).controller('workshopsCtrl', function($scope, $http, $location, sessionService) {

	$scope.loading = true;

	setTimeout(function(){
	   $('select').material_select();
	}, 0);

	var setupUser = function() {
		$scope.user = sessionService.getUser();
		var url = 'api/workshops/';
		$http.get(url).then(function(res){
			$scope.workshops = res.data.workshops;
			$scope.loading = false;
		}, function(err){
			alert("Internal server error! Tente novamente mais tarde. =/");
			console.log(err);
			$scope.loading = false;
		});
	}

	$scope.user = sessionService.getUser();
	if (!$scope.user){
		sessionService.checkAuth(function(isAuthenticated){
			if (isAuthenticated && sessionService.getUser().hasPayed){
				setupUser();
			} else {
				$location.path('/');
			}
		});
	} else if ($scope.user.hasPayed){
		setupUser();
	} else {
		$location.path('/');
	}

	$scope.saveWorkshops = function(workshop1, workshop2){
		var workshop1Input = $("#workshop1 input");
		var workshop2Input = $("#workshop2 input");
		var workshopsInput = $(".select-wrapper input");

		var submitWorkshops = function(){
			var oldWs = [];

			$scope.workshops.forEach(function(w) {
				if (w.enrolled.indexOf($scope.user._id) > -1){
					oldWs.push(w._id);
				}
			});
			var url = 'api/users/' + sessionService.getUser()._id + '/selectWorkshops/';
			$scope.loading = true;
			$http.put(url, {token: sessionService.getToken(), workshop1: workshop1, workshop2: workshop2, oldWs: oldWs}).then(function(res){
				if (res.data.result.includes("NV"))
					alert("Um ou mais minicursos estão com as vagas esgotadas! :(");
				setupUser();
			}, function(err){
				if (err.status === 401){
					alert("Alunos do IFF de Bom Jesus já estão inscritos em minicursos previamente combinados!");
				} else {
					alert("Internal server error! Tente novamente mais tarde. =/");
					console.log(err);
				}
				$scope.loading = false;
			});
		};

		var incompabilityError = function() {
			workshopsInput.addClass("error-highlight");
			alert("Horários incompatíveis!");
		};

		if (!workshop1 && !workshop2)
			workshopsInput.addClass("error-highlight");
		else if (workshop1 === workshop2)
			workshopsInput.addClass("error-highlight");
		else {
			workshopsInput.removeClass("error-highlight");
			if ((workshop1 === undefined || workshop2 === undefined) && $scope.user.isIff) {
				submitWorkshops();
			} else if (!workshop1) {
				workshop1Input.addClass("error-highlight");
			} else if (!workshop2) {
				workshop1Input.removeClass("error-highlight");
				workshop2Input.addClass("error-highlight");
			} else if (workshop1.charAt(0) !== workshop2.charAt(0)){
				submitWorkshops();
			} else {
				if (workshop1.charAt(1) === '1' && (workshop2.charAt(1) === '3' || workshop2.charAt(1) === '4')) {
					incompabilityError();
				} else if (workshop2.charAt(1) === '1' && (workshop1.charAt(1) === '3' || workshop1.charAt(1) === '4')) {
					incompabilityError();
				} else {
					submitWorkshops();
				}
			}
		}
	}

});
