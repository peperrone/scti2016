(function($){
  $(function(){

    $('.button-collapse').sideNav();

    if (typeof(Storage) === "undefined") {
		alert("Desculpa! Seu browser não é suportado pelo nosso site =/ Tente atualizá-lo ou utilize algum outro. :)");
	}

	// START BUG REPORT FLOATING FORM CODE
	var _scroll = true, _timer = false, _floatbox = $("#contact_form"), _floatbox_opener = $(".contact-opener") ;
    _floatbox.css("right", "-306px");
    
    _floatbox_opener.click(function(){
        if (_floatbox.hasClass('visiable')){
            _floatbox.animate({"right":"-306px"}, {duration: 300}).removeClass('visiable');
        }else{
           _floatbox.animate({"right":"0px"},  {duration: 300}).addClass('visiable');
        }
    });

    $(document).click(function(e) {
	    if (e.target.id != 'contact_form' && !$('#contact_form').find(e.target).length) {
	        _floatbox.animate({"right":"-306px"}, {duration: 300}).removeClass('visiable');
	    }
	});

    $(window).scroll(function(){
        if(_scroll){
            _floatbox.animate({"top": "30px"},{duration: 300});
            _scroll = false;
        }
        if(_timer !== false){ clearTimeout(_timer); }           
            _timer = setTimeout(function(){_scroll = true; 
            _floatbox.animate({"top": "10px"},{easing: "linear"}, {duration: 500});}, 400); 
    });
    // END BUG REPORT FLOATING FORM CODE

  }); // end of document ready
})(jQuery); // end of jQuery name space
