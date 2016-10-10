angular.module('ScheduleCtrl', []).controller('scheduleCtrl', function($scope, $http) {

  $scope.showTalks = true;
  $scope.openModal = function() {
    $('#modal1').openModal();
  };
});
