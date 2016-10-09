angular.module('TshirtCtrl', []).controller('tshirtCtrl', function($scope, $http, sessionService) {

	setTimeout(function(){
	   $('select').material_select();
	}, 0);

	var user = sessionService.getUser();
	if (user.tshirt){
		$scope.sizeList = user.tshirt.type === "Comum" ? 1 + user.tshirt.size : 2 + user.tshirt.size;
		$scope.modelList = user.tshirt.model;
	}
	
	$scope.saveTshirtModel = function(sizeList, modelList){
		if (!sizeList || !modelList) return;
		var tshirt = {};

		tshirt.type = sizeList.charAt(0) === 1 ? "Comum" : "Babylook";
		tshirt.size = sizeList.substring(1);
		tshirt.model = modelList;

		var url = 'api/users/' + sessionService.getUser()._id + '/tshirt';
		$http.put(url, {token: sessionService.getToken(), tshirt: tshirt}).then(function(res){
			alert("Tipo de camisa escolhido com sucesso!");
			user = res.data.user;
			sessionService.setSession({token: sessionService.getToken(), user: user});
		}, function(err){
			console.log(err);
		})
	}
});
