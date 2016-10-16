var app = angular.module('sctiAppAdmin', ['AdminCtrl']);

angular.module('AdminCtrl', []).controller('adminCtrl', function($scope, $http) {

	$http.get('api/users').then(function(res){
		console.log(res);
		$scope.users = res.data.users;

	}, function(err) {
		console.log(err);
	});

	$scope.createdAt = function(id){
		var timestamp = id.toString().substring(0,8);
		return new Date( parseInt( timestamp, 16 ) * 1000 ).toLocaleString("pt-BR");
	}
});