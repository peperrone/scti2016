var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');

router.post('/signin', userCtrl.signin);

//router.get('/:userId', userCtrl.getUser);
router.post('/signup', userCtrl.signup);
router.put('/users/:id', userCtrl.isAuthenticated, userCtrl.edit);
//router.remove('/users/:userId', userCtrl.delete);

router.post('/users/:id/sendVerification', 
			userCtrl.isAuthenticated, userCtrl.sendVerification);

router.post('/users/:id/validate', 
			userCtrl.isAuthenticated, userCtrl.validate);

module.exports = router;