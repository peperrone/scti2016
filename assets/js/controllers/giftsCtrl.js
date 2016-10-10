angular.module('GiftsCtrl', []).controller('giftsCtrl', function($scope, $http) {

  $scope.showBenefits = true;
  $scope.openModal = function() {
    $('#modal1').openModal();
  };
});
