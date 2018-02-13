var mongoose = require('mongoose');

var TeamSchema = mongoose.Schema({
    name: String,
    code: String,
    crestUrl: String
});
mongoose.model('Team', TeamSchema);

module.exports = mongoose.model('Team');