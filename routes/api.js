var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');
var paypalCtrl = require('../controllers/paypalListener');
var auth = require('./public').auth;

router.post('/signin', userCtrl.signin);
router.post('/signup', userCtrl.signup);
router.get('/users', auth, userCtrl.getUsers);
router.put('/users/:id', userCtrl.isAuthenticated, userCtrl.edit);
router.post('/users/:id/sendVerification', 
			userCtrl.isAuthenticated, userCtrl.sendVerification);
router.post('/users/:id/validate', 
			userCtrl.isAuthenticated, userCtrl.validate);
router.post('/users/:id/validateGiftCode',
			userCtrl.isAuthenticated, userCtrl.validateGiftCode);
router.post('/lostPassword', userCtrl.lostPassword);
router.put('/resetPassword', userCtrl.resetPassword);
router.get('/resetCode/:resetCode', userCtrl.resetCode);
router.post('/authenticate', userCtrl.isAuthenticated, userCtrl.authenticate);
router.post('/paypalReturn', paypalCtrl.listener);
router.post('/sendBugReport', userCtrl.sendBugReport);

module.exports = router;