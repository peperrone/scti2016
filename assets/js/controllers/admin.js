var app = angular.module('sctiAppAdmin', ['AdminCtrl']);

angular.module('AdminCtrl', []).controller('adminCtrl', function($scope, $http) {
	$http.get('api/users').then(function(res){
		console.log(res);
		$scope.users = res.data.users;
	}, function(err) {
		console.log(err);
	});
});