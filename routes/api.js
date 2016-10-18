var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');
var paypalCtrl = require('../controllers/paypalListener');
var workshopCtrl = require('../controllers/workshops');
var auth = require('./public').auth;

router.post('/signin', userCtrl.signin);
router.post('/signup', userCtrl.signup);
router.get('/users', auth, userCtrl.getUsers);
router.post('/users/:id/sendVerification', 
			userCtrl.isAuthenticated, userCtrl.sendVerification);
router.post('/users/:id/validate', 
			userCtrl.isAuthenticated, userCtrl.validate);
router.post('/users/:id/validateGiftCode',
			userCtrl.isAuthenticated, userCtrl.validateGiftCode);
router.put('/users/:id/changeEmail',
			userCtrl.isAuthenticated, userCtrl.changeEmail, userCtrl.sendVerification);
router.put('/users/:id/tshirt',
			userCtrl.isAuthenticated, userCtrl.changeTshirt);
router.put('/users/:id/changeName',
			userCtrl.isAuthenticated, userCtrl.changeName);
router.put('/users/:id/changePassword',
			userCtrl.isAuthenticated, userCtrl.changePassword);
router.post('/lostPassword', userCtrl.lostPassword);
router.put('/resetPassword', userCtrl.resetPassword);
router.get('/resetCode/:resetCode', userCtrl.resetCode);
router.post('/authenticate', userCtrl.isAuthenticated, userCtrl.authenticate);
router.post('/paypalReturn', paypalCtrl.listener);
router.post('/sendBugReport', userCtrl.sendBugReport);
router.get('/workshops', workshopCtrl.getWorkshops);
router.put('/users/:id/selectWorkshops', userCtrl.isAuthenticated, workshopCtrl.isNotIffBomje, workshopCtrl.removeUserFromWorkshops, workshopCtrl.selectWorkshops);

module.exports = router;