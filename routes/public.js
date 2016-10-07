var express = require('express');
var router = express.Router();
var config = require('config');

var EMAIL_PREFIX = process.env.emailPrefix || config.emailPrefix;
var EMAIL_PASSWORD = process.env.emailPassword || config.emailPassword;

var auth = function(req, res, next){
	var auth;
    if (req.headers.authorization) {
      auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }
    if (!auth || auth[0] !== EMAIL_PREFIX || auth[1] !== EMAIL_PASSWORD) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        res.end('Unauthorized');
    } else {
        next();
    }
};

var commonRoutes = ['/user', '/forgotpassword', '/newpassword/:userId', '/schedule', '/gifts', '/editAccount', '/'];

router.get('/routes/:name', function (req, res){
	var name = req.params.name;
  	res.render(name);
});

router.get(commonRoutes, function(req, res) {
	res.render("index");
});

router.get('/admin', auth, function(req, res) {
	res.render("admin");
});

router.get('*', function(req, res) {
	res.json("OOooooooops! Nothing to do here. :(");
});

module.exports = {
    auth: auth,
    router: router
};
