var app = angular.module('sctiAppAdmin', ['AdminCtrl']);

angular.module('AdminCtrl', []).controller('adminCtrl', function($scope, $http) {
	$scope.option = "Workshops";
	var errCallback = function(err){
		console.log(err);
	}

	function hasPaid(user) {
		return user.hasPayed;
	}

	$http.get('api/users').then(function(res){
		$scope.users = res.data.users;
		var paidUsers = $scope.users.filter(hasPaid);
		$http.get('api/workshops/').then(function(res){
			$scope.workshops = res.data.workshops;
			$scope.workshops.forEach(function(ws){
				ws.users = [];
				paidUsers.forEach(function(user){
					if (ws.enrolled.includes(user._id)){
						ws.users.push(user);
					}
				});
			});
		}, errCallback);
	}, errCallback);

	$scope.createdAt = function(id){
		var timestamp = id.toString().substring(0,8);
		return new Date( parseInt( timestamp, 16 ) * 1000 ).toLocaleString("pt-BR");
	}
});