var express = require('express');
var router = express.Router();

router.get('/', function (req, res){
  	res.render("index");
});

router.get('/user', function (req, res){
  	res.render("user_page");
});

module.exports = router;