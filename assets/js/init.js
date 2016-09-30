(function($){
  $(function(){
    //=========== GOOGLE ANALYTICS START ===========
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-84082109-1', 'auto');
    ga('send', 'pageview');
    //=========== GOOGLE ANALYTICS END ===========

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
