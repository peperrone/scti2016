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
router.post('/lostPassword', userCtrl.lostPassword);
router.post('/authenticate', userCtrl.isAuthenticated, userCtrl.authenticate);

module.exports = router;