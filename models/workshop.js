var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Workshop', new Schema({ 
    _id: String,
    name: String, 
    startsAt: String,
    endsAt: String, 
    weekday: String,
    vacancy: Number,
    enrolled: [String],
    scannedUsers: [String]
}));