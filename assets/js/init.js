(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.modal-trigger').leanModal();

    $('#loginBtn').click(function(){
    	if (!$('#email2').val() || !$('#password3').val()) return;
    	if ($('#email2').hasClass('invalid') || $('#password3').hasClass('invalid')) return;
    	var user = {
    		email: $('#email2').val(),
    		password: $('#password3').val()
    	};
    	$.post("/api/signin", user, function(res) {
			if (res.success) {
				window.location = '/user';
			} else {
				if (res.message.includes('User not found')){
					$('#email2').removeClass('valid').addClass('invalid');
					$('#labelEmail2').attr("data-error", "Conta de usuário não encontrada!");
				} else {
					$('#password3').removeClass('valid').addClass('invalid');
					$('#labelPassword3').attr("data-error", "Senha incorreta!");
				}
				console.log(res.message);
			}
		});
    	
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
