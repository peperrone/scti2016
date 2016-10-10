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

module.exports.getUsers = function(req, res) {
	User.find({}, function(err, users){
		if (err) {
			res.status(500).json({success: false, message: err.errmsg});
		} else if (users) {
			res.json({success: true, users: users});
		}
	})
};

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

module.exports.changeName = function(req, res){
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    res.status(409).json({success: false, message: "User not found/updated!"});
	  else {
	    if (req.body.name) user.name = req.body.name;
	    user.save();
	    res.json({success: true, message: "User updated succesfully!", user: user});
	  }
	});
};

module.exports.changePassword = function(req, res){
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user || err)
	    res.status(409).json({success: false, message: "User not found/updated!"});
	  else {
	    bcrypt.compare(req.body.oldPassword, user.password, function(bcryptErr, bcryptRes) {
	    	if (bcryptErr) {
	    		res.status(401).json({
	    			success: false,
	    			message: bcryptErr
	    		})
	    	}
	    	if (bcryptRes) {
	    		bcrypt.hash(req.body.newPassword, saltRounds, function(err2, hash){
					if (err2) res.status(500).json({success: false, message: err2.errmsg});
					user.password = hash;
					user.save(function(err3) {
						if (err3) {
							res.status(409).json({success: false, message: err3.errmsg});
						}
						req.params.id = user.id;
						res.json({success: true, user: user});
					});
				});
	    	} else {
	    		res.status(401).json({success: false, message: "Authentication failed. Incorrect password!"});
	    	}
		});
	  }
	});
};

module.exports.changeEmail = function(req, res, next){
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    return res.status(409).json({success: false, message: "User not found/updated!"});
	  else {
	    if (req.body.email) {
	    	User.findOne({email: req.body.email}, function(err, user2){
	    		if (!user2){
	    			user.email = req.body.email;
	    			user.isValidated = false;
	    			user.save();
	    			return next();
	    		} else {
	    			return res.status(409).json({success: false, message: "Email already in use!"});
	    		}
	    	});
	    }
	  }
	});
};

module.exports.changeTshirt = function(req, res){
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    return res.status(409).json({success: false, message: "User not found/updated!"});
	  else {
	    user.tshirt = req.body.tshirt;
	    user.save();
	    res.json({success: true, user: user});
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
	var transporterURL = 'smtps://' + EMAIL_PREFIX + ':' + EMAIL_PASSWORD + '@smtp.' + EMAIL_SUFFIX;
	var transporter = nodemailer.createTransport(transporterURL);
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
			res.status(409).json({success: false, message: "User not found!"});
		} else {
			if (err) throw err;
			var resetCode = null;
			crypto.randomBytes(16, (err, buf) => {
				if (err) return;
				resetCode = `${buf.toString('hex')}`;
				var subject = "SCTI - Link para redefinição de senha";
				var passwordResetLink = "scti.herokuapp.com/newpassword/" + resetCode;
				var htmlBody = "Esqueceu sua senha?<br>Por favor clique nesse link para definir uma nova senha:" + passwordResetLink +"<br>Se não foi você que solicitou esse e-mail, por favor ignore-o";
				sendEmail(req.body.email, htmlBody, subject, function(error) {
					if (error) {
						res.status(500).json({success: false, message: "Something wrong with nodemailer or internet connection!", error: error});
					} else {
						user.resetCode = resetCode;
						user.save();
						res.json({success: true, message: "Link to change password was sent!"});
					}
				});
			});
		}
	});
};

module.exports.resetPassword = function(req, res) {
	User.findOne({resetCode: req.body.resetCode}, function(err, user){
		if (!user) {
			res.status(409).json({success: false, message: "User not found"});
		} else if (err) {
			console.log(err);
			res.status(500).json({success: false, message: "Something wrong!"});
		} else {
			bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash){
				if (err) {
					res.status(500).json({success: false, message: err.errmsg});
					return;
				}
				user.password = hash;
				user.resetCode = null;
				user.save(function(err) {
					if (err) {
						res.status(409).json({success: false, message: err.errmsg});
					}
					res.json({success: true, message: "Password updated successfully!"});
				});
			});
		}
	});
}

module.exports.resetCode = function(req, res) {
	User.findOne({resetCode: req.params.resetCode}, function(err, user){
		if (!user) {
			res.status(409).json({success: false, message: "User not found"});
		} else if (err) {
			console.log(err);
			res.status(500).json({success: false, message: "Something wrong!"});
		} else {
			res.status(200).json({success: true, resetCode: user.resetCode});
		}
	})
}

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

module.exports.sendBugReport = function(req, res) {
	var visitor = req.body;
	sendEmail("scti@uenf.br", JSON.stringify(visitor), "Bug Report", function(error){
		if (!error) {
			res.json({success: true, message: "Email sent!"});
		} else {
			res.status(500).json({success: false, message: error});
		}
	});
};