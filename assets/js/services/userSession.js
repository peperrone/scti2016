app.service('sessionService', function($window, $http) {

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

  var checkAuth = function(callback){
    if (session.user) callback(true);
    var token = $window.localStorage.token;
    if (token) {
      $http.post('/api/authenticate', {token: token}).then(function(res) {
        session = res.data;
        callback(true);
      }, function(err) {
        if (err.data.message)
          console.log(err.data.message);
        callback(false);
      });
    } else {
      callback(false);
    }
  }

  return {
    setSession: setSession,
    getToken: getToken,
    getUser: getUser,
    checkAuth: checkAuth
  };

});