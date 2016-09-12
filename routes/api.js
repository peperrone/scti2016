var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');

router.post('/signin', userCtrl.signin);
router.post('/signup', userCtrl.signup);
router.put('/users/:id', userCtrl.isAuthenticated, userCtrl.edit);
router.post('/users/:id/sendVerification', 
			userCtrl.isAuthenticated, userCtrl.sendVerification);
router.post('/users/:id/validate', 
			userCtrl.isAuthenticated, userCtrl.validate);
router.post('/users/:id/validateGiftCode',
			userCtrl.isAuthenticated, userCtrl.validateGiftCode);
router.post('/lostPassword', userCtrl.lostPassword);
router.post('/authenticate', userCtrl.isAuthenticated, userCtrl.authenticate);
router.post('/paypalReturn', function(req, res) {
	console.log(req);
});

module.exports = router;