angular.module('ScheduleCtrl', []).controller('scheduleCtrl', function($scope, $http) {

  $scope.showTalks = true;

  $scope.openModal = function() {
    $('#modal1').openModal();
  };

  $scope.sendGaTalksPageview = function() {
    ga('send', 'pageview', '/talks');
  }

  $scope.sendGaWorkshopPageview = function() {
    ga('send', 'pageview', '/workshops');
  }

  $scope.sendGaEvent = function() {
    ga('send', 'event', 'outbound-link', 'click', 'inscreva-se');
  }

  $scope.$on('$viewContentLoaded', function(event) {
    ga('send', 'pageview', '/talks');
  });
});
