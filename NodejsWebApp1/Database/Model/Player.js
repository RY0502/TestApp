var mongoose = require('mongoose');

var PlayerSchema = mongoose.Schema({
    name: String,
    preferredposition: String,
    dob: Date,
    imagelink: String,
    team: String
});

exports.playerModel = mongoose.model('Player', PlayerSchema);