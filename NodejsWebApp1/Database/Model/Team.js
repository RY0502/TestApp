var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: String,
    code: String,
    cresturl: String
});

exports.teamModel = mongoose.model('team', teamSchema);