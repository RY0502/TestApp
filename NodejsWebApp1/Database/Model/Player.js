var mongoose = require('mongoose');

var PlayerSchema = mongoose.Schema({
    name: String,
    preferredposition: String,
    imagelink: String,
    team: String
});

exports.playerModel = mongoose.model('Player', PlayerSchema);