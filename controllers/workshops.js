var User = require('../models/user');
var GiftCode = require('../models/giftcode');
var Workshop = require('../models/workshop');
var bomjeGiftCodes = [];

GiftCode.find({}, function(err, giftCodes){
	if (giftCodes){
		giftCodes.forEach(function(g){
			if (bomjeGiftCodes.length > 49) {
				return;
			}
			if (g.code.length === 6){
				bomjeGiftCodes.push(g.code);
			}
		});
	}
});

module.exports.isNotIffBomje = function(req, res, next) {
	GiftCode.findOne({userId: req.params.id}, function(err, giftCode){
		if (!giftCode) {
			next();
		} else {
			if (bomjeGiftCodes.indexOf(giftCode.code) > -1){
				res.status(401).json({success: false, message: "Cannot singup for workshops!"});
			} else {
				next();
			}
		}
	});	
}

module.exports.addScannedUsers = function(req, res) {
	Workshop.findOne({_id: req.params.id}, function(err, workshop){
		if (!workshop || err) {
			res.status(400).json({success: false, message: "Something went wrong!"});
		} else {
			var users = req.body.users;
			if (!workshop.scannedUsers) workshop.scannedUsers = [];
			workshop.scannedUsers.forEach(function(user){
				var index = users.indexOf(user);
				if (index > -1){
					users.splice(index, 1);
				}
			});
			users.forEach(function(user){
				workshop.scannedUsers.push(user);
			});
			workshop.markModified('scannedUsers');
			workshop.save();
			res.json({success: true, message: "Cool ;P"});
		}
	});	
}

module.exports.getWorkshops = function(req, res) {
	Workshop.find({}, function(err, workshops){
		if (err) {
			res.status(500).json({success: false, message: err.errmsg});
		} else if (workshops) {
			res.json({success: true, workshops: workshops});
		}
	})
};

module.exports.removeUserFromWorkshops = function(req, res, next) {
	var oldWs = req.body.oldWs;
	var newWs = [req.body.workshop1, req.body.workshop2];
	for (var i = 0; i < oldWs.length; i++){
		for (var j = 0; j < newWs.length; j++){
			if (oldWs[i] === newWs[j]){
				oldWs.splice(i--, 1);
				newWs.splice(j--, 1);
			}
		}
	}
	var count = oldWs.length;
	req.body.newWs = newWs;

	if(oldWs.length === 0) next();
	oldWs.forEach(function(w) {
		Workshop.findOne({_id: w}, function(err, workshop){
			var index = workshop.enrolled.indexOf(req.params.id);
			if (index > -1) {
				workshop.enrolled.splice(index, 1);
				workshop.vacancy++;
			}
			workshop.markModified('vacancy');
			workshop.save();
			count--;
			if (count === 0){
				next();
			}
		});
	});
}

module.exports.selectWorkshops = function(req, res) {
	var newWs = req.body.newWs;
	var count = newWs.length;
	var result = [];
	if(newWs.length === 0) res.json({success:true, result: "Prul"});

	newWs.forEach(function(w){
		if (w === undefined){
			count--;
			if (count === 0) {
				res.json({success:true, result: result});
			}
		}
		Workshop.findOne({_id: w}, function(err, workshop){
			var result = [];
			if (err) {
				//do nothing
			} else if (workshop) {
				if (workshop.enrolled.length === 0){
					workshop.enrolled = [];
				}
				if (workshop.vacancy > 0){
					workshop.enrolled.push(req.params.id);
					workshop.vacancy--;
					workshop.save();
					result.push(w);
				} else {
					result.push("NV");
				}			
			} else {
				//do nothing
			}
			count--;
			if (count === 0) {
				res.json({success:true, result: result});
			}
		})	
	});
};