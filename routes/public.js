var express = require('express');
var router = express.Router();

router.get('/routes/:name', function (req, res){
	var name = req.params.name;
  	res.render(name);
});

router.get('/user', function(req, res) {
	res.render("index");
});

router.get('/', function(req, res) {
	res.render("index");
});

router.get('*', function(req, res) {
	res.json("OOooooooops! Nothing to do here. :(");
});

module.exports = router;