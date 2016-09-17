(function($){
  $(function(){

    $('.button-collapse').sideNav();

    if (typeof(Storage) === "undefined") {
		alert("Desculpa! Seu browser não é suportado pelo nosso site =/ Tente atualizá-lo ou utilize algum outro. :)");
	}
  }); // end of document ready
})(jQuery); // end of jQuery name space
