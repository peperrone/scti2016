app.service('sessionService', function() {

  var session = {};

  var setSession = function(data) {
      session = data;
  };

  var getToken = function(){
      return session.token;
  };

  var getUser = function(){
      return session.user;
  };

  return {
    setSession: setSession,
    getToken: getToken,
    getUser: getUser
  };

});