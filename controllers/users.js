var User   = require('../models/user');
var bcrypt = require('bcrypt');
var jwt    = require('jsonwebtoken');
var config = require('../config');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const saltRounds = 10;

module.exports.signup = function(req, res, next) {
	var user = new User(req.body);
	user.isValidated = false;
	user.verificationCode = null;
	user.hasPayed = false;
	bcrypt.hash(user.password, saltRounds, function(err, hash){
		if (err) res.json({success: false, message: err.errmsg});
		user.password = hash;
		user.save(function(err) {
			if (err) {
				res.json({success: false, message: err.errmsg});
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
			res.json({success: false, message: "Authentication failed. User not found!"});
		} else {
			bcrypt.compare(req.body.password, user.password, function(bcryptErr, bcryptRes) {
		    	if (bcryptErr) throw bcryptErr;
		    	if (bcryptRes) {
		    		var token = jwt.sign(user, config.secret, {
			        	expiresIn: 3600 // expires in 1 hour
			        });

			        res.json({
			          success: true,
			          message: 'Enjoy your token!',
			          token: token,
			          user: user
			        });
		    	} else {
		    		res.json({success: false, message: "Authentication failed. Incorrect password!"});
		    	}
			});
		}
	});
};

module.exports.edit = function(req, res){
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    res.json({success: false, message: "User not found/updated!"});
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
    if (req.headers.token) {
	    jwt.verify(req.headers.token, config.secret, function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        req.decoded = decoded;    
	        return next();
	      }
	    });
	} else {
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });  
	}
};

module.exports.sendVerification = function(req, res, next) {

	var verificationCode = null;
	var transporter = nodemailer.createTransport('smtps://rafael.ghossi%40gmail.com:rualzine@smtp.gmail.com');

	crypto.randomBytes(16, (err, buf) => {
		if (err) throw err;
		verificationCode = `${buf.toString('hex')}`;
		var htmlBody = 'Entre com o codigo <b>' + verificationCode + '</b> no site da SCTI para validar seu e-mail. <br>';
		var mailOptions = {
		    from: '"SCTI 2016" <rafael.ghossi@gmail.com>', // sender address
		    to: req.body.email, // list of receivers
		    subject: 'SCTI - Codigo de verificacao de email', // Subject line
		    html: htmlBody
		};

		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        res.json({success: false, message: error});
		    }
		    User.findOne({_id: req.params.id}, function(err, user) {
			  if (!user)
			    res.json({success: false, message: "User not found"});
			  else {
			  	user.verificationCode = verificationCode;
			    user.save();
			    console.log(user);
			    res.json({success: true, message: "Verification code sent succesfully!", user: user});
			  }
			});
		});
	});
};

module.exports.validate = function(req, res) {
	User.findOne({_id: req.params.id}, function(err, user) {
	  if (!user)
	    res.json({success: false, message: "User not found"});
	  else if (user.verificationCode != req.body.verificationCode){
	  	res.json({success: false, message: "Wrong code. Try again!"});
	  } else {
	  	user.verificationCode = null;
	  	user.isValidated = true;
	  	user.save();
	    res.json({success: true, message: "Your email was succesfully validated!", user: user});
	  }
	});
}