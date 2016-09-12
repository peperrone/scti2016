var User   = require('../models/user');
var request = require('request');

module.exports.listener = function(req, res) {
	console.log(req.body);
	if (req.body){
		var newBody = {cmd: "_notify-validate"};
		for(var key in req.body) 
			newBody[key] = req.body[key];
		request.post({url:'https://www.sandbox.paypal.com/cgi-bin/webscr', form: newBody}, function(err,response,body){
			if (!err && response.statusCode == 200) {
			    if (body === "VERIFIED") {
			    	User.findOne({_id: req.body.custom}, function(mongoErr, user){
			    		if (mongoErr) {
			    			console.log(mongoErr);
			    		} else if (!user) {
			    			console.log("User not found");
			    		} else {
			    			user.hasPayed = true;
			    			user.paymentMethod = 'paypal';
			    			user.transaction = req.body;
			    			user.save();
			    		}
			    	})
			    }
			} else {
				console.log(err);
			}
			res.json("yay");
		})
	}
}