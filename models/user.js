var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tshirt = new Schema({
	type: String,
	size: String, 
	model: String
});

module.exports = mongoose.model('User', new Schema({ 
    name: String, 
    password: String,
    email: {type: String, index: {unique: true}},
    isValidated: Boolean,
    paymentMethod: String,
    hasPayed: Boolean,
    verificationCode: String,
    transaction: Object,
    resetCode: {type: String, index: {unique: true}},
    tshirt: Tshirt
}));