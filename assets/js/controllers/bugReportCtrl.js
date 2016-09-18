angular.module('BugReportCtrl', []).controller('bugReportCtrl', function($scope, $http) {
	$scope.loading = false;
	$scope.visitor = {};

	$scope.submit = function(visitor){
		if (!visitor.name){
			$('#icon_prefix').removeClass("valid").addClass("invalid");
		} else if (!visitor.email) {
			$('#icon_email').removeClass("valid").addClass("invalid");
		} else if (!visitor.message) {
			$('#icon_message').removeClass("valid").addClass("invalid");
		} else {
			$scope.loading = true;
			$http.post('api/sendBugReport', visitor).then(function(res){
				alert("Mensagem enviada com sucesso!");
				$("#contact_form").animate({"right":"-306px"}, {duration: 300}).removeClass('visiable');
				$scope.visitor = {};
				$scope.loading = false;
			}, function(err){
				alert("Sua mensagem não pode ser enviada! =/");
				console.log(err);
				$scope.loading = false;
			});
		}


	};
});