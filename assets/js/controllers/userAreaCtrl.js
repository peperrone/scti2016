angular.module('UserAreaCtrl', []).controller('userAreaCtrl', function($scope, sessionService) {

    $scope.user = sessionService.getUser();
    
});