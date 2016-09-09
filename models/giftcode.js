var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('GiftCode', new Schema({ 
    code: {type: String, index: {unique: true}},
    userId: String
}));