var User   = require('../models/user');
var GiftCode   = require('../models/giftcode');
var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken');
var config = require('config');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const saltRounds = 10;

var SECRET = process.env.SECRET || config.secret;
var EMAIL_PREFIX = process.env.emailPrefix || config.emailPrefix;
var EMAIL_SUFFIX = process.env.emailSuffix || config.emailSuffix;
var EMAIL_PASSWORD = process.env.emailPassword || config.emailPassword;

module.exports.signup = function(req, res, next) {
	var user = new User(req.body);
	user.isValidated = false;
	user.verificationCode = null;
	user.hasPayed = false;
	bcrypt.hash(user.password, saltRounds, function(err, hash){
		if (err) res.status(500).json({success: false, message: err.errmsg});
		user.password = hash;
		user.save(function(err) {
			if (err) {
				res.status(409).json({success: false, message: err.errmsg});
			}
			req.params.id = user.id;
			res.json({success: true, user: user});
		});
	});
};

module.exports.signin = function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.status(401).json({success: false, message: "Authentication failed. User not found!"});
		} else {
			bcrypt.compare(req.body.password, user.password, function(bcryptErr, bcryptRes) {
		    	if (bcryptErr) throw bcryptErr;
		    	if (bcryptRes) {
		    		var token = jwt.sign(user, SECRET, {
			        	expiresIn: "2h"
			        });

			        res.json({
			          success: true,
			          message: 'Enjoy your token!',
			          token: token,
			          user: user
			        });
		    	} else {
		    		res.status(401).json({success: false, message: "Authentication failed. Incorrect password!"});
		    	}
			});
		}
	});
};

module.exports.edit = function(req, res){
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    res.status(409).json({success: false, message: "User not found/updated!"});
	  else {
	    if (req.body.hasPayed) user.hasPayed = req.body.hasPayed;
	    if (req.body.name) user.name = req.body.name;
	    if (req.body.isValidated) user.isValidated = req.body.isValidated;
	    if (req.body.paymentMethod) user.paymentMethod = req.body.paymentMethod;
	    if (req.body.verificationCode) user.verificationCode = req.body.verificationCode;
	    user.save();
	    res.json({success: true, message: "User updated succesfully!", user: user});
	  }
	});
};

module.exports.isAuthenticated = function (req, res, next) {
    if (req.body.token) {
	    jwt.verify(req.body.token, SECRET, function(err, decoded) {      
	      if (err) {
	        return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        req.decoded = decoded;    
	        return next();
	      }
	    });
	} else {
	    return res.status(400).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });  
	}
};

module.exports.authenticate = function(req, res) {
	var decode = jwt.decode(req.body.token);
	User.findOne({_id: decode._doc._id}, function(err, user) {
		if (!user) {
			res.status(403).json({success: false, message: "User not found"});
		} else {
			res.status(200).json({ success: true, user: user, token: req.body.token});
		}
	});
};

var sendEmail = function(email, htmlBody, subject, callback) {
	var transporterURL = 'smtps://' + EMAIL_PREFIX':' + EMAIL_PASSWORD + '@smtp.' + EMAIL_SUFFIX;
	var transporter = nodemailer.createTransport(transporterURL);
	console.log(transporter);
	var mailOptions = {
	    from: '"SCTI 2016" <' + EMAIL_PREFIX + '@' + EMAIL_SUFFIX + '>', // sender address
	    to: email, // list of receivers
	    subject: subject, // Subject line
	    html: htmlBody
	};

	transporter.sendMail(mailOptions, function(error, info){
		console.log(error);
	    if(error)
	    	callback(error);
	    else
	    	callback(false);
	});
}

module.exports.sendVerification = function(req, res, next) {

	var verificationCode = null;
	var subject = 'SCTI - Codigo de verificacao de email';
	crypto.randomBytes(16, (err, buf) => {
		if (err) throw err;
		verificationCode = `${buf.toString('hex')}`;
		var htmlBody = 'Entre com o codigo <b>' + verificationCode + '</b> no site da SCTI para validar seu e-mail. <br>';
		sendEmail(req.body.user.email, htmlBody, subject, function(error){
			if (!error) {
				User.findOne({_id: req.params.id}, function(err, user) {
				  if (!user)
				    res.status(409).json({success: false, message: "User not found"});
				  else {
				  	user.verificationCode = verificationCode;
				    user.save();
				    res.json({success: true, message: "Verification code sent succesfully!", user: user});
				  }
				});
			} else {
				res.status(500).json({success: false, message: error});
			}
		});
	});
};

module.exports.validate = function(req, res) {
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    res.status(409).json({success: false, message: "User not found"});
	  else if (user.verificationCode != req.body.verificationCode){
	  	res.status(403).json({success: false, message: "Wrong code. Try again!"});
	  } else {
	  	user.verificationCode = null;
	  	user.isValidated = true;
	  	user.save();
	    res.json({success: true, message: "Your email was succesfully validated!", user: user});
	  }
	});
}

module.exports.lostPassword = function(req, res) {
	User.findOne({
		email: req.body.email
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.status(409).json({success: false, message: "Email not found!"});
		} else {
			var subject = "SCTI - Link para redefinição de senha";
			//TODO: send link to change user password. 
			var htmlBody = "Soon!";
			sendEmail(req.body.email, htmlBody, subject, function(error) {
				if (error) {
					res.status(500).json({success: false, message: error});
				} else {
					res.json({success: true, message: "Link to change password was sent!"});
				}
			});
		}
	});
};

module.exports.validateGiftCode = function(req, res) {
	User.findOne({_id: req.params.id}, function(err, user) {
		if (!user) {
	    	res.status(409).json({success: false, message: "User not found"});
		} else {
			GiftCode.findOne({code: req.body.giftCode}, function(err, giftCode){
				if (!giftCode) {
					res.status(403).json({success: false, message: "Code not found"});
				} else {
					if (giftCode.userId != null) {
						res.status(409).json({success: false, message: "Sorry. Someone has already taken this one!"});
					} else {
						user.hasPayed = true;
						giftCode.userId = req.params.id;
						giftCode.save();
						user.save();
					    res.json({success: true, message: "Your payment was approved!", user: user, giftCode: giftCode});
					}
				}
			});	
	  	}
	});
};