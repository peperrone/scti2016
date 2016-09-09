angular.module('UserAreaCtrl', []).controller('userAreaCtrl', function($scope, sessionService) {

    $scope.user = sessionService.getUser();
	$('#paypal').on('click', function(){
		if($('#local-pay').hasClass('active')){
    		$('#local-pay').removeClass('active waves-effect z-depth-2');
    		$('#localpay-btn').addClass('sleep');
    	}
    	$('#paypal').addClass('active waves-effect z-depth-2');
    	$('#paypal-btn').removeClass('sleep');
    });
    $('#local-pay').on('click', function(){
		if($('#paypal').hasClass('active')){
    		$('#paypal').removeClass('active waves-effect z-depth-2');
    		$('#paypal-btn').addClass('sleep');
    	}
    	$('#local-pay').addClass('active waves-effect z-depth-2');
    	$('#localpay-btn').removeClass('sleep');
    });
});